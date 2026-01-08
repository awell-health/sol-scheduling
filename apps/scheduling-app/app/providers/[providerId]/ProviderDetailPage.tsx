'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import Link from 'next/link';
import {
  useOnboarding,
  useBuildUrlWithUtm,
  isSupportedState,
  getBorderingTargetState,
} from '../_lib/onboarding';
import { useProvider, useAvailability } from './hooks';
import {
  ProviderHeader,
  AvailabilityCalendar,
  BookingForm,
  getSlotModes,
  type BookingFormValues,
} from './components';
import { BookingProgressModal } from './BookingProgressModal';
import { useBookingWorkflow } from '../../hooks';
import { AvailabilitySlot } from '../_lib/types';
import { format } from 'date-fns';

interface ProviderDetailPageProps {
  providerId: string;
}

export const ProviderDetailPage: React.FC<ProviderDetailPageProps> = ({
  providerId,
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
    error: providerError,
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
    defaultMonth,
  } = useAvailability(providerId);

  // Booking state
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
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
            state: preferences.state,
          });
          router.replace(url);
        } else {
          const url = buildUrlWithUtm('/not-available', {
            state: preferences.state,
          });
          router.replace(url);
        }
      }
    }
  }, [isInitialized, isOnboardingComplete, preferences.state, router, buildUrlWithUtm]);

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
      service: preferences.service ?? undefined,
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
        })(),
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
          bookingStatus={bookingWorkflow.state.status}
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
        onRetry={bookingWorkflow.retry}
        onDismiss={bookingWorkflow.reset}
      />
    </div>
  );
};
