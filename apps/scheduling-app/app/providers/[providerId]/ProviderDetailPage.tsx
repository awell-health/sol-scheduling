'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, startOfToday } from 'date-fns';
import {
  DayButton,
  type DayButtonProps
} from 'react-day-picker';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AvailabilitySlot,
  ProviderSummary
} from '../_lib/types';
import {
  bookAppointmentAction,
  getAvailabilityAction,
  getProviderAction
} from '../actions';
import { clearSolPreferenceStorage } from '../_lib/preferences';
import { ProviderBio } from '../components/ProviderBio';
import { MapPinIcon, VideoCameraIcon } from '../components/icons/ProviderIcons';
import { Calendar } from '../../../components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { PhoneInput } from '../../../components/ui/phone-input';
import { Label } from '../../../components/ui/label';
import Link from 'next/link';

const PATIENT_NAME = 'Demo Patient';
const PLACEHOLDER_AVATAR =
  '/images/avatar.svg';

const INSURANCE_OPTIONS = [
  { value: 'Aetna', label: 'Aetna' },
  { value: 'Allegiance', label: 'Allegiance' },
  { value: 'BCBS - Anthem', label: 'BCBS - Anthem' },
  { value: 'BCBS - Empire', label: 'BCBS - Empire' },
  { value: 'BCBS - Carefirst', label: 'BCBS - Carefirst' },
  { value: 'BCBS - TX', label: 'BCBS - TX' },
  { value: 'Cigna', label: 'Cigna' },
  { value: 'Elevance / Carelon', label: 'Elevance / Carelon' },
  { value: 'EmblemHealth', label: 'EmblemHealth' },
  { value: 'First Health', label: 'First Health' },
  { value: 'Healthfirst', label: 'Healthfirst' },
  { value: 'Kaiser', label: 'Kaiser' },
  { value: 'Magnacare', label: 'Magnacare' },
  { value: 'Medicaid', label: 'Medicaid' },
  { value: 'Medicare', label: 'Medicare' },
  { value: 'Multiplan / Claritev', label: 'Multiplan / Claritev' },
  { value: 'Northwell Direct', label: 'Northwell Direct' },
  { value: 'Optum', label: 'Optum' },
  { value: 'Oscar', label: 'Oscar' },
  { value: 'Oxford', label: 'Oxford' },
  { value: 'Tricare', label: 'Tricare' },
  { value: 'UMR', label: 'UMR' },
  { value: 'UnitedHealthcare', label: 'UnitedHealthcare' },
  { value: '1199', label: '1199' },
  { value: 'Other', label: 'Other' }
];

type BookingState =
  | { status: 'idle' }
  | { status: 'booking'; eventId: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const BookingFormSchema = z.object({
  phone: z
    .string()
    .nonempty('Mobile number is required')
    .refine((value) => value.replace(/\D/g, '').length === 10, {
      message: 'Please enter a valid U.S. phone number.'
    }),
  visitMode: z.enum(['In-Person', 'Telehealth']).optional(),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message:
        'You must consent to receiving calls or text messages about this appointment.'
    })
      ,
  insuranceCarrier: z.string().optional()
});

type BookingFormValues = z.infer<typeof BookingFormSchema>;

  const SlotDayButton: React.FC<
    DayButtonProps & { daySlotMap: Map<string, AvailabilitySlot[]> }
  > = (props) => {
  const getLocalDayKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const { day, modifiers, ...buttonProps } = props;
  const date = day.date;
    const key = getLocalDayKey(date);
    const count = props.daySlotMap.get(key)?.length ?? 0;
  const today = startOfToday();
  const isFuture = date >= today;
    const hasSlots = count > 0 && isFuture;

    let secondaryLabel: string | null = null;
    if (isFuture) {
      secondaryLabel = count > 0 ? String(count) : '-';
    }

  return (
    <DayButton {...buttonProps} day={day} modifiers={modifiers}>
      <div className='flex h-9 w-9 flex-col items-center justify-center gap-0.5 rounded-md leading-none'>
        <span>{date.getDate()}</span>
        {secondaryLabel && (
          <span
            className={
              hasSlots
                ? 'text-[10px] font-semibold text-emerald-700'
                : 'text-[10px] font-medium text-slate-400'
            }
          >
            {secondaryLabel}
          </span>
        )}
      </div>
    </DayButton>
  );
};

export const ProviderDetailPage: React.FC<{ providerId: string }> = ({ providerId }) => {
  const [provider, setProvider] = useState<ProviderSummary | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const [providerLoading, setProviderLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [bookingState, setBookingState] = useState<BookingState>({
    status: 'idle'
  });
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [insuranceQuery, setInsuranceQuery] = useState('');
  const [isInsuranceDropdownOpen, setIsInsuranceDropdownOpen] = useState(false);
  const bookingFormRef = useRef<HTMLDivElement | null>(null);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    mode: 'onChange',
    defaultValues: {
      phone: '',
      visitMode: undefined,
      consent: false,
      insuranceCarrier: undefined
    }
  });
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting }
  } = form;
  const visitMode = watch('visitMode');
  const consent = watch('consent');

  const getLocalDayKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let cancelled = false;

    async function loadProvider() {
      try {
        setProviderLoading(true);
        setProviderError(null);
        const response = await getProviderAction(providerId);
        if (!cancelled) {
          setProvider(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setProviderError(
            err instanceof Error
              ? err.message
              : 'Unable to load provider details'
          );
        }
      } finally {
        if (!cancelled) {
          setProviderLoading(false);
        }
      }
    }

    loadProvider();
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting);
      },
      {
        threshold: 0.2
      }
    );

    observer.observe(headerEl);

    return () => {
      observer.disconnect();
    };
  }, [providerLoading, provider]);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError(null);
        const response = await getAvailabilityAction(providerId);
        const providerSlots = response.data?.[providerId] ?? [];
        const sortedSlots = providerSlots
          .map((slot) => ({
            ...slot,
            slotstart: slot.slotstart
          }))
          .sort(
            (first, second) =>
              new Date(first.slotstart).getTime() -
              new Date(second.slotstart).getTime()
          );
        if (!cancelled) {
          setSlots(sortedSlots);
        }
      } catch (err) {
        if (!cancelled) {
          setAvailabilityError(
            err instanceof Error
              ? err.message
              : 'Unable to load availability'
          );
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  const upcomingSlots = useMemo(() => {
    const now = Date.now();
    return slots.filter(
      (slot) => new Date(slot.slotstart).getTime() > now && slot.booked !== true
    );
  }, [slots]);

  const locationOptions = useMemo(() => {
    const modes = new Set<string>();
    upcomingSlots.forEach((slot) => {
      const mode = slot.location ?? slot.eventType;
      if (mode) modes.add(mode);
    });
    return Array.from(modes);
  }, [upcomingSlots]);

  const filteredSlots = useMemo(() => {
    if (locationFilter === 'all') return upcomingSlots;
    return upcomingSlots.filter(
      (slot) => (slot.location ?? slot.eventType) === locationFilter
    );
  }, [upcomingSlots, locationFilter]);

  const daySlotMap = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();

    filteredSlots.forEach((slot) => {
      const date = new Date(slot.slotstart);
      const key = getLocalDayKey(date);
      const existing = map.get(key);
      if (existing) {
        existing.push(slot);
      } else {
        map.set(key, [slot]);
      }
    });

    return map;
  }, [filteredSlots]);

  const daysWithSlots = useMemo(
    () =>
      Array.from(daySlotMap.keys()).map((key) => {
        const [year, month, day] = key.split('-').map(Number);
        return new Date(year, month - 1, day);
      }),
    [daySlotMap]
  );

  const defaultSelectedDate = useMemo(() => {
    if (filteredSlots.length === 0) return undefined;
    return new Date(filteredSlots[0].slotstart);
  }, [filteredSlots]);

  useEffect(() => {
    setSelectedDate(defaultSelectedDate);
  }, [defaultSelectedDate?.getTime()]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const key = getLocalDayKey(selectedDate);
    return daySlotMap.get(key) ?? [];
  }, [selectedDate, daySlotMap]);

  const searchParams = useSearchParams();
  const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    if (availabilityLoading || slots.length === 0) return;

    const eventIdFromUrl = searchParams.get('eventId');
    if (!eventIdFromUrl) {
      hasInitializedFromUrl.current = true;
      return;
    }

    const matchingSlot = slots.find((slot) => slot.eventId === eventIdFromUrl);
    if (matchingSlot) {
      const matchDate = new Date(matchingSlot.slotstart);
      setSelectedDate(matchDate);
      setSelectedSlot(matchingSlot);

      const modes = slotModes(matchingSlot);
      if (modes.inPerson && modes.virtual) {
        setValue('visitMode', undefined, { shouldValidate: true });
      } else if (modes.inPerson) {
        setValue('visitMode', 'In-Person', { shouldValidate: true });
      } else if (modes.virtual) {
        setValue('visitMode', 'Telehealth', { shouldValidate: true });
      } else {
        setValue('visitMode', undefined, { shouldValidate: true });
      }

      requestAnimationFrame(() => {
        bookingFormRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }

    hasInitializedFromUrl.current = true;
  }, [availabilityLoading, slots, searchParams, setSelectedDate]);

  const slotModes = (slot: AvailabilitySlot) => {
    const mode = slot.location ?? slot.eventType;
    const isTelehealth = mode === 'Telehealth';
    const isInPerson = mode === 'In-Person';

    // Business rule: any in-person visit can also be virtual
    return {
      inPerson: isInPerson,
      virtual: isTelehealth || isInPerson
    };
  };

  const selectedSlotSummary = useMemo(() => {
    if (!selectedSlot) return null;
    const when = format(
      new Date(selectedSlot.slotstart),
      "EEE MMM d 'at' h:mm a"
    );
    const modes = slotModes(selectedSlot);
    let modeText: string;
    if (visitMode) {
      modeText =
        visitMode === 'In-Person' ? 'In-person' : 'Virtual video visit';
    } else if (modes.inPerson && modes.virtual) {
      modeText = 'In-person or virtual';
    } else if (modes.inPerson) {
      modeText = 'In-person';
    } else if (modes.virtual) {
      modeText = 'Virtual';
    } else {
      modeText = selectedSlot.eventType;
    }

    const meta = `${selectedSlot.duration} mins • ${modeText}`;

    return { when, meta };
  }, [selectedSlot, visitMode]);

  

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setBookingState({ status: 'idle' });

    const modes = slotModes(slot);
    if (modes.inPerson && modes.virtual) {
      setValue('visitMode', undefined, { shouldValidate: true });
    } else if (modes.inPerson) {
      setValue('visitMode', 'In-Person', { shouldValidate: true });
    } else if (modes.virtual) {
      setValue('visitMode', 'Telehealth', { shouldValidate: true });
    } else {
      setValue('visitMode', undefined, { shouldValidate: true });
    }

    requestAnimationFrame(() => {
      bookingFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  };

  const router = useRouter();

  const handleSubmitBooking = async (data: BookingFormValues) => {
    if (!selectedSlot) return;

    const chosenLocation =
      data.visitMode ??
      selectedSlot.location ??
      selectedSlot.eventType ??
      'Virtual';

    setBookingState({ status: 'booking', eventId: selectedSlot.eventId });
    try {
      await bookAppointmentAction({
        eventId: selectedSlot.eventId,
        providerId: selectedSlot.providerId,
        userInfo: {
          userName: PATIENT_NAME,
          ...(data.insuranceCarrier
            ? { insuranceCarrier: data.insuranceCarrier }
            : {})
        },
        locationType: chosenLocation
      });

      setBookingState({
        status: 'success',
        message: 'Appointment requested successfully. We will confirm shortly.'
      });

      // Clear SOL browsing preferences once a booking is completed.
      clearSolPreferenceStorage();

      const providerNameForParams =
        provider?.firstName && provider?.lastName
          ? `${provider.firstName} ${provider.lastName}`
          : provider?.firstName || provider?.lastName || 'Provider';

      const params = new URLSearchParams({
        providerId: selectedSlot.providerId,
        providerName: providerNameForParams,
        providerImage: provider?.image ?? '',
        startsAt: selectedSlot.slotstart.toString(),
        duration: String(selectedSlot.duration),
        locationType: String(chosenLocation),
        facility: selectedSlot.facility ?? '',
        state: provider?.location?.state ?? ''
      });

      router.push(`/providers/confirmation?${params.toString()}`);
    } catch (err) {
      console.error('Failed to book appointment', err);
      setBookingState({
        status: 'error',
        message:
          err instanceof Error ? err.message : 'Unable to complete booking'
      });
    }
  };

  const needsLocationChoice = useMemo(() => {
    if (!selectedSlot) return false;
    const modes = slotModes(selectedSlot);
    return modes.inPerson && modes.virtual;
  }, [selectedSlot]);

  const canSubmitBooking = useMemo(() => {
    if (!selectedSlot) return false;
    if (!isValid) return false;
    if (needsLocationChoice && !visitMode) return false;
    if (bookingState.status === 'booking' || isSubmitting) return false;
    return true;
  }, [selectedSlot, isValid, needsLocationChoice, visitMode, bookingState.status, isSubmitting]);

  const renderSlot = (slot: AvailabilitySlot) => {
    const startsAt = new Date(slot.slotstart);
    const time = format(startsAt, 'h:mm a');
    const { inPerson, virtual } = slotModes(slot);

    const isSelected = selectedSlot?.eventId === slot.eventId;

    return (
      <li
        key={slot.eventId}
        className='flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'
      >
        <div>
          <p className='text-base font-semibold text-slate-900'>{time}</p>
          <div className='mt-1 flex items-center gap-2 text-sm text-slate-600'>
            <span className='flex items-center gap-1'>
              {inPerson && (
                <MapPinIcon className='h-3 w-3 text-secondary-foreground' />
              )}
              {virtual && (
                <VideoCameraIcon className='h-3 w-3 text-secondary-foreground' />
              )}
            </span>
            <span>
              {inPerson && virtual
                ? 'In-person or virtual'
                : inPerson
                  ? 'In-person'
                  : virtual
                    ? 'Virtual'
                    : slot.eventType}
            </span>
          </div>
          <p className='mt-1 text-xs text-slate-500'>
            {slot.duration} mins
            {slot.facility ? ` • ${slot.facility}` : ''}
          </p>
          {slot.facility && (
            <p className='mt-0.5 text-xs text-slate-500'>
              Location: {slot.facility}
            </p>
          )}
        </div>
        <button
          type='button'
          onClick={() => handleSelectSlot(slot)}
          className={`mt-2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition ${
            isSelected
              ? 'bg-secondary text-secondary-foreground shadow-card'
              : 'border border-slate-200 bg-white text-primary hover:bg-slate-50'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </li>
    );
  };

  const providerName =
    provider?.firstName && provider?.lastName
      ? `${provider.firstName} ${provider.lastName}`
      : provider?.firstName || provider?.lastName || 'Provider';

  return (
    <div className='flex flex-col gap-6'>
      {provider && (
        <div
          className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center transition-opacity duration-200 ${
            showStickyHeader ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='pointer-events-auto w-full border-b border-slate-200 bg-white/90 backdrop-blur-md'>
            <div className='mx-auto flex max-w-3xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8'>
              <Link
                href='/providers'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-slate-600 hover:text-slate-900'
                aria-label='Back to providers'
              > 
                ←
              </Link>
              <div className='relative h-8 w-8 overflow-hidden rounded-full bg-slate-100'>
                <Image
                  src={provider.image || PLACEHOLDER_AVATAR}
                  alt={providerName}
                  sizes='32px'
                  unoptimized
                  fill
                  placeholder='blur'
                  blurDataURL='/images/avatar.svg'
                  className='object-cover'
                />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold text-slate-900'>
                  {providerName}
                </p>
                {(provider.location?.facility || provider.location?.state) && (
                  <p className='truncate text-xs text-slate-600'>
                    {provider.location?.facility}
                    {provider.location?.facility && provider.location?.state ? (
                      <span className='text-slate-400'>
                        {' '}
                        · {provider.location.state}
                      </span>
                    ) : (
                      provider.location?.state
                    )}
                  </p>
                )}
                {selectedSlotSummary && (
                  <p className='truncate text-[11px] text-slate-500'>
                    {selectedSlotSummary.when} • {selectedSlotSummary.meta}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Link
        href='/providers'
        className='w-fit text-sm font-semibold text-slate-600 hover:text-slate-900'
      >
        ← Back to providers
      </Link>

      {providerLoading ? (
        <div className='rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>
          Loading provider details…
        </div>
      ) : providerError ? (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800'>
          {providerError}
        </div>
      ) : (
        provider && (
          <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
            <header
              ref={headerRef}
              className='flex flex-col gap-4 md:flex-row md:items-start md:gap-6'
            >
              <div className='relative h-32 w-32 flex-none overflow-hidden rounded-full bg-slate-100'>
                <Image
                  src={provider.image || PLACEHOLDER_AVATAR}
                  alt={providerName}
                  sizes='128px'
                  unoptimized
                  fill
                  placeholder='blur'
                  blurDataURL='/images/avatar.svg'
                  className='object-cover'
                />
              </div>
              <div className='space-y-2'>
              <h1 className='text-3xl font-bold text-slate-900'>
                {providerName}
              </h1>
                {(provider.location?.facility || provider.location?.state) && (
                  <div className='flex items-center gap-1 text-sm text-slate-600'>
                    <MapPinIcon className='h-4 w-4 text-secondary-foreground' />
                    <span>
                      {provider.location?.facility}
                      {provider.location?.facility && provider.location?.state ? (
                        <span className='text-slate-400'>
                          {' '}
                          · {provider.location.state}
                        </span>
                      ) : (
                        provider.location?.state
                      )}
                    </span>
                  </div>
                )}
              </div>
            </header>
            <div className='mt-4'>
              <ProviderBio
                text={provider.bio}
                profileLink={provider.profileLink}
                showIntroHeading
              />
            </div>
          </section>
        )
      )}

      <section className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='text-lg font-semibold text-slate-900'>
            Upcoming availability
          </h2>
          {locationOptions.length > 1 && (
            <div className='flex items-center gap-2 text-xs text-slate-600'>
              <span className='font-medium'>Location</span>
              <Select
                value={locationFilter}
                onValueChange={(value) => setLocationFilter(value)}
              >
                <SelectTrigger className='h-8 w-40 text-xs'>
                  <SelectValue placeholder='All locations' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All locations</SelectItem>
                  {locationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {availabilityLoading ? (
          <div className='rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>
            Loading availability…
          </div>
        ) : availabilityError ? (
          <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800'>
            {availabilityError}
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600'>
            No open slots at the moment. Please check back soon.
          </div>
        ) : (
          <div className='space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='text-sm text-slate-700'>
                {selectedDate
                  ? `Showing times for ${format(selectedDate, 'EEEE, MMM d')}`
                  : 'Select a date to see available times.'}
              </div>
            </div>

            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={setSelectedDate}
              fromMonth={startOfToday()}
              disabled={(date: Date) => date < startOfToday()}
              modifiers={{ hasSlots: daysWithSlots }}
              modifiersClassNames={{
                hasSlots: 'font-semibold text-emerald-700',
                selected:
                  'bg-secondary text-secondary-foreground rounded-md !ring-0 !border-0',
                today:
                  'ring-1 ring-secondary text-secondary-foreground rounded-md'
              }}
              components={{
                DayButton: (props) => <SlotDayButton {...props} daySlotMap={daySlotMap} />
              }}
              numberOfMonths={1}
            />

            <div className='mt-2'>
              {slotsForSelectedDate.length === 0 ? (
                <p className='text-sm text-slate-600'>
                  No open slots for this day. Try another date.
                </p>
              ) : (
                <ul className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
                  {slotsForSelectedDate.map(renderSlot)}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>

      {bookingState.status === 'success' && (
        <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900'>
          {bookingState.message}
        </div>
      )}

      {bookingState.status === 'error' && (
        <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>
          {bookingState.message}
        </div>
      )}
      {selectedSlot && (
        <section
          ref={bookingFormRef}
          className='space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6'
        >
          <div>
            <h3 className='text-base font-semibold text-primary'>
              Complete your booking
            </h3>
            {selectedSlotSummary && (
              <div className='mt-2 inline-flex w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 sm:w-auto'>
                <div className='flex flex-col text-left'>
                  <span className='font-medium'>{selectedSlotSummary.when}</span>
                  <span className='text-[11px] text-slate-600'>
                    {selectedSlotSummary.meta}
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setSelectedSlot(null);
                    reset();
                    setBookingState({ status: 'idle' });
                  }}
                  className='text-xs font-semibold text-primary hover:underline'
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(handleSubmitBooking)} className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='phone'>Mobile number</Label>
              <Controller
                name='phone'
                control={form.control}
                render={({ field }) => (
                  <PhoneInput
                    id='phone'
                    {...field}
                    className={
                      errors.phone
                        ? 'border-red-500 focus-visible:ring-red-500/20'
                        : undefined
                    }
                  />
                )}
              />
              <p className='text-xs text-slate-500'>
                We’ll use this number to send updates about your appointment. U.S. numbers
                only.
              </p>
              {errors.phone && (
                <p className='text-xs font-medium text-red-600'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className='space-y-1'>
              <Label htmlFor='insurance'>Insurance</Label>
              <Controller
                name='insuranceCarrier'
                control={form.control}
                render={({ field }) => {
                  const filteredOptions = INSURANCE_OPTIONS.filter((option) =>
                    option.label.toLowerCase().includes(insuranceQuery.toLowerCase())
                  );

                  return (
                    <div className='relative'>
                      <Input
                        id='insurance'
                        value={insuranceQuery || field.value || ''}
                        onChange={(event) => {
                          const next = event.target.value;
                          setInsuranceQuery(next);
                          setIsInsuranceDropdownOpen(true);

                          const exactMatch = INSURANCE_OPTIONS.find(
                            (option) =>
                              option.label.toLowerCase() === next.toLowerCase()
                          );

                          if (exactMatch) {
                            field.onChange(exactMatch.value);
                          } else if (next === '') {
                            field.onChange(undefined);
                          }
                        }}
                        onFocus={() => setIsInsuranceDropdownOpen(true)}
                        onBlur={() => {
                          // Slight delay to allow option click handlers to run
                          setTimeout(() => setIsInsuranceDropdownOpen(false), 100);
                        }}
                        placeholder='Start typing to search your insurance'
                        autoComplete='off'
                      />
                      {isInsuranceDropdownOpen && filteredOptions.length > 0 && (
                        <ul className='absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-card'>
                          {filteredOptions.map((option) => (
                            <li
                              key={option.value}
                              className='cursor-pointer px-3 py-1.5 hover:bg-slate-50'
                              onMouseDown={(event) => {
                                // Prevent input blur before onClick runs
                                event.preventDefault();
                              }}
                              onClick={() => {
                                field.onChange(option.value);
                                setInsuranceQuery(option.label);
                                setIsInsuranceDropdownOpen(false);
                              }}
                            >
                              {option.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }}
              />
              <p className='text-xs text-slate-500'>
                Help us to confirm your coverage. If you&apos;re not sure, you can
                leave this blank.
              </p>
            </div>

            {(() => {
              const modes = slotModes(selectedSlot);
              if (modes.inPerson && modes.virtual) {
                return (
                  <fieldset className='space-y-2'>
                    <legend className='text-sm font-medium text-slate-700'>
                      How would you like to attend?
                    </legend>
                    <div className='flex flex-col gap-2 sm:flex-row'>
                      <label className='flex cursor-pointer items-center gap-2 text-sm text-slate-700'>
                        <input
                          type='radio'
                          name='visitMode'
                          value='In-Person'
                          checked={visitMode === 'In-Person'}
                          onChange={() =>
                            setValue('visitMode', 'In-Person', {
                              shouldValidate: true
                            })
                          }
                          className='h-4 w-4 accent-primary'
                        />
                        <span>
                          In-person
                          {selectedSlot.facility ? ` at ${selectedSlot.facility}` : ''}
                        </span>
                      </label>
                      <label className='flex cursor-pointer items-center gap-2 text-sm text-slate-700'>
                        <input
                          type='radio'
                          name='visitMode'
                          value='Telehealth'
                          checked={visitMode === 'Telehealth'}
                          onChange={() =>
                            setValue('visitMode', 'Telehealth', {
                              shouldValidate: true
                            })
                          }
                          className='h-4 w-4 accent-primary'
                        />
                        <span>Virtual (video visit)</span>
                      </label>
                    </div>
                    {needsLocationChoice && !visitMode && (
                      <p className='text-xs font-medium text-red-600'>
                        Please choose in-person or virtual.
                      </p>
                    )}
                  </fieldset>
                );
              }

              if (modes.inPerson) {
                return (
                  <p className='text-sm text-slate-600'>
                    This appointment will be <span className='font-semibold'>in-person</span>
                    {selectedSlot.facility ? ` at ${selectedSlot.facility}` : ''}.
                  </p>
                );
              }

              if (modes.virtual) {
                return (
                  <p className='text-sm text-slate-600'>
                    This appointment will be a{' '}
                    <span className='font-semibold'>virtual video visit</span>.
                  </p>
                );
              }

              return null;
            })()}

            <div className='space-y-1'>
              <label className='flex items-start gap-2 text-xs text-slate-700'>
                <input
                  type='checkbox'
                  checked={consent}
                  onChange={(event) =>
                    setValue('consent', event.target.checked, {
                      shouldValidate: true
                    })
                  }
                  className='mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary'
                />
                <span>
                  I consent to receiving calls or text messages at this number about this
                  appointment (not for marketing messages).
                </span>
              </label>
              {errors.consent && (
                <p className='text-xs font-medium text-red-600'>
                  {errors.consent.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              className='mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
              disabled={!canSubmitBooking}
            >
              {bookingState.status === 'booking' ? 'Booking…' : 'Book appointment'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}


