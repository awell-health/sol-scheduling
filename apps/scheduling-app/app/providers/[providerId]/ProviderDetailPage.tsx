'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import Link from 'next/link';
import {
  useOnboarding,
  useBuildUrlWithUtm,
  isSupportedState,
  getBorderingTargetState
} from '../_lib/onboarding';
import { useProvider, useAvailability } from './hooks';
import {
  ProviderHeader,
  AvailabilityCalendar,
  BookingForm,
  getSlotModes,
  type BookingFormValues
} from './components';
import { BookingProgressModal } from './BookingProgressModal';
import { useBookingWorkflow } from '../../hooks';
import { AvailabilitySlot } from '../_lib/types';
import { format } from 'date-fns';
import {
  getAnyStoredLeadId,
  clearAllBookingStorage,
  ensureLeadExistsAction,
  storeLeadId
} from '../_lib/salesforce';
import { trackAppointment } from '../../../lib/tracking';

interface ProviderDetailPageProps {
  providerId: string;
}

export const ProviderDetailPage: React.FC<ProviderDetailPageProps> = ({
  providerId
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const { preferences, isOnboardingComplete, isInitialized } = useOnboarding();
  const buildUrlWithUtm = useBuildUrlWithUtm();

  // Get clinical focus from URL params (passed from providers list page)
  const clinicalFocusFromUrl = searchParams.get('clinicalFocus') ?? undefined;

  // Data fetching hooks
  const {
    provider,
    loading: providerLoading,
    error: providerError
  } = useProvider(providerId);

  const {
    slots,
    loading: availabilityLoading,
    error: availabilityError,
    filteredSlots,
    daySlotMap,
    daysWithSlots,
    locationOptions,
    locationFilter,
    setLocationFilter,
    defaultMonth
  } = useAvailability(providerId);

  // Booking state
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null
  );
  const bookingWorkflow = useBookingWorkflow({ posthog });

  // Redirect to onboarding if not complete
  useEffect(() => {
    if (isInitialized && !isOnboardingComplete) {
      const url = buildUrlWithUtm('/onboarding', { target: pathname });
      router.replace(url);
    }
  }, [isInitialized, isOnboardingComplete, pathname, router, buildUrlWithUtm]);

  // Redirect to /not-available or /onboarding/bordering if state is not supported
  useEffect(() => {
    if (isInitialized && isOnboardingComplete && preferences.state) {
      if (!isSupportedState(preferences.state)) {
        const borderTarget = getBorderingTargetState(preferences.state);
        if (borderTarget) {
          const url = buildUrlWithUtm('/onboarding/bordering', {
            state: preferences.state
          });
          router.replace(url);
        } else {
          const url = buildUrlWithUtm('/not-available', {
            state: preferences.state
          });
          router.replace(url);
        }
      }
    }
  }, [
    isInitialized,
    isOnboardingComplete,
    preferences.state,
    router,
    buildUrlWithUtm
  ]);

  // Determine if we're redirecting
  const isRedirecting =
    !isInitialized ||
    !isOnboardingComplete ||
    (preferences.state && !isSupportedState(preferences.state));

  // Handler for slot selection
  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    bookingWorkflow.reset();
  };

  // Handler for clearing slot
  const handleClearSlot = () => {
    setSelectedSlot(null);
  };

  // Handler for booking submission
  const handleSubmitBooking = async (data: BookingFormValues) => {
    if (!selectedSlot) return;

    // Check Salesforce lead status before proceeding
    const leadResult = getAnyStoredLeadId();

    // Get phone from form data or preferences
    const phone = data.phone || preferences.phone;

    // If no lead ID and no phone, redirect to onboarding
    if (!leadResult && !phone) {
      console.log(
        '[handleSubmitBooking] No lead found and no phone, redirecting to onboarding...'
      );
      clearAllBookingStorage();

      posthog?.capture('booking_redirected_to_onboarding', {
        provider_id: selectedSlot.providerId,
        reason: 'missing_lead_id_and_phone'
      });

      const onboardingUrl = buildUrlWithUtm('/onboarding', {
        target: pathname
      });
      router.push(onboardingUrl);
      return;
    }

    // Ensure lead exists in Salesforce (validates existing or creates new if deleted/converted)
    if (phone) {
      try {
        console.log('[handleSubmitBooking] Ensuring lead exists...');
        const ensureResult = await ensureLeadExistsAction({
          currentLeadId: leadResult?.leadId,
          phone,
          state: preferences.state,
          service: preferences.service,
          insurance: preferences.insurance,
          consent: preferences.consent,
          posthogDistinctId: posthog?.get_distinct_id()
        });

        if (!ensureResult.success || !ensureResult.leadId) {
          console.error(
            '[handleSubmitBooking] Failed to ensure lead exists:',
            ensureResult.error
          );
          // Show error but don't redirect - let user retry
          return;
        }

        // If lead was recreated, update localStorage
        if (ensureResult.wasRecreated) {
          storeLeadId(ensureResult.leadId, phone);
          posthog?.capture('lead_recreated_at_booking', {
            previous_lead_id: leadResult?.leadId,
            new_lead_id: ensureResult.leadId,
            reason: 'lead_deleted_or_converted'
          });
          console.log('[handleSubmitBooking] Lead was recreated:', {
            previousLeadId: leadResult?.leadId,
            newLeadId: ensureResult.leadId
          });
        }
      } catch (err) {
        console.error('[handleSubmitBooking] Error ensuring lead exists:', err);
        // If we have no lead ID at all, we need to redirect
        if (!leadResult?.leadId) {
          const onboardingUrl = buildUrlWithUtm('/onboarding', {
            target: pathname
          });
          router.push(onboardingUrl);
          return;
        }
        // Otherwise, try to proceed with existing lead ID (might fail but worth trying)
      }
    } else if (!leadResult?.leadId) {
      // No phone and no lead ID - redirect to onboarding
      console.log(
        '[handleSubmitBooking] No phone and no lead, redirecting to onboarding...'
      );
      const onboardingUrl = buildUrlWithUtm('/onboarding', {
        target: pathname
      });
      router.push(onboardingUrl);
      return;
    }

    // Proceed with booking
    const chosenLocation =
      data.visitMode ??
      selectedSlot.location ??
      selectedSlot.eventType ??
      'Virtual';

    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userName = `${data.firstName} ${data.lastName}`;

    await bookingWorkflow.startBooking({
      eventId: selectedSlot.eventId,
      providerId: selectedSlot.providerId,
      userName,
      locationType: chosenLocation,
      slotStartTime: new Date(selectedSlot.slotstart).toISOString(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      state: preferences.state ?? undefined,
      patientTimezone: browserTimezone,
      clinicalFocus: clinicalFocusFromUrl,
      service: preferences.service ?? undefined
    });

    // Track appointment conversion in WhatConverts (after successful booking start)
    trackAppointment({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: phone || '',
      appointmentTime: selectedSlot.slotstart
    });
  };

  // Compute selected slot summary for header
  const selectedSlotSummary = selectedSlot
    ? {
        when: format(new Date(selectedSlot.slotstart), "EEE MMM d 'at' h:mm a"),
        meta: (() => {
          const modes = getSlotModes(selectedSlot);
          let modeText: string;
          if (modes.inPerson && modes.virtual) {
            modeText = 'In-person or virtual';
          } else if (modes.inPerson) {
            modeText = 'In-person';
          } else if (modes.virtual) {
            modeText = 'Virtual';
          } else {
            modeText = selectedSlot.eventType;
          }
          return `${selectedSlot.duration} mins • ${modeText}`;
        })()
      }
    : null;

  // Loading state
  if (isRedirecting) {
    return (
      <div className='flex flex-col gap-6'>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <span className='text-sm text-slate-500'>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Sticky + main header */}
      {provider && (
        <ProviderHeader
          provider={provider}
          selectedSlotSummary={selectedSlotSummary}
        />
      )}

      <Link
        href='/providers'
        className='w-fit text-sm font-semibold text-slate-600 hover:text-slate-900'
      >
        ← Back to providers
      </Link>

      {/* Provider loading/error states */}
      {providerLoading && (
        <div className='rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>
          Loading provider details…
        </div>
      )}

      {providerError && !providerLoading && (
        <section className='rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm'>
          <h2 className='text-base font-semibold text-primary'>
            We can&apos;t find this provider
          </h2>
          <p className='mt-2'>
            The link you followed may be out of date, or this provider is no
            longer available. Please go back and choose a different provider.
          </p>
          <Link
            href='/providers'
            className='mt-4 inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50'
          >
            Back to providers
          </Link>
        </section>
      )}

      {/* Availability calendar */}
      <AvailabilityCalendar
        loading={availabilityLoading}
        error={availabilityError}
        filteredSlots={filteredSlots}
        allSlots={slots}
        daySlotMap={daySlotMap}
        daysWithSlots={daysWithSlots}
        locationOptions={locationOptions}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
        selectedSlot={selectedSlot}
        onSlotSelect={handleSlotSelect}
        defaultMonth={defaultMonth}
      />

      {/* Booking form (shown when slot is selected) */}
      {selectedSlot && (
        <BookingForm
          selectedSlot={selectedSlot}
          preferences={preferences}
          bookingStatus={bookingWorkflow.bookingFormStatus}
          bookingError={bookingWorkflow.error}
          isModalOpen={bookingWorkflow.isModalOpen}
          onClearSlot={handleClearSlot}
          onSubmit={handleSubmitBooking}
          onResetWorkflow={bookingWorkflow.reset}
        />
      )}

      {/* Booking progress modal */}
      <BookingProgressModal
        isOpen={bookingWorkflow.isModalOpen}
        currentStep={bookingWorkflow.currentStep}
        error={bookingWorkflow.error}
        isWaiting={bookingWorkflow.isWaiting}
        showProviderAvailability={bookingWorkflow.showProviderAvailability}
        onRetry={bookingWorkflow.retry}
        onDismiss={bookingWorkflow.reset}
        onProviderAvailability={() => {
          bookingWorkflow.reset();
          // Scroll to top to show availability calendar
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
