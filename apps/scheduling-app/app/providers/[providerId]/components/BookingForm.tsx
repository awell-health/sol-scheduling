'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  isValidPhoneNumber,
  type E164Number,
} from '../../../../components/ui/phone-input';
import { Input } from '../../../../components/ui/input';
import { PhoneInput } from '../../../../components/ui/phone-input';
import { Label } from '../../../../components/ui/label';
import { AvailabilitySlot } from '../../_lib/types';
import {
  FieldId,
  FIELD_REGISTRY,
  INSURANCE_OPTIONS,
  useBookingFormFields,
} from '@/lib/fields';
import { OnboardingPreferences } from '../../_lib/onboarding';
import { getSlotModes } from './AvailabilityCalendar';

const BookingFormSchema = z.object({
  phone: z
    .string()
    .nonempty('Mobile number is required')
    .refine(
      (value) => {
        try {
          return isValidPhoneNumber(value, 'US');
        } catch {
          return false;
        }
      },
      {
        message: 'Please enter a valid U.S. phone number.',
      }
    ),
  visitMode: z.enum(['In-Person', 'Telehealth']).optional(),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message:
        'You must consent to receiving calls or text messages about scheduling details.',
    }),
  insuranceCarrier: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export type BookingFormValues = z.infer<typeof BookingFormSchema>;

interface SelectedSlotSummary {
  when: string;
  meta: string;
}

interface BookingFormProps {
  /** The selected slot to book */
  selectedSlot: AvailabilitySlot;
  /** Onboarding preferences for pre-filling */
  preferences: OnboardingPreferences;
  /** Booking workflow status */
  bookingStatus: 'idle' | 'starting' | 'booking' | 'redirecting' | 'error' | 'success';
  /** Error message from booking workflow */
  bookingError: string | null;
  /** Whether the modal is open */
  isModalOpen: boolean;
  /** Handler to clear the selected slot */
  onClearSlot: () => void;
  /** Handler to submit the booking */
  onSubmit: (data: BookingFormValues) => Promise<void>;
  /** Handler to reset the booking workflow */
  onResetWorkflow: () => void;
}

/**
 * Booking form with name, phone, insurance, consent, and visit mode fields.
 */
export function BookingForm({
  selectedSlot,
  preferences,
  bookingStatus,
  bookingError,
  isModalOpen,
  onClearSlot,
  onSubmit,
  onResetWorkflow,
}: BookingFormProps) {
  const bookingFormRef = useRef<HTMLDivElement | null>(null);
  const [insuranceQuery, setInsuranceQuery] = useState('');
  const [isInsuranceDropdownOpen, setIsInsuranceDropdownOpen] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    mode: 'onChange',
    defaultValues: {
      phone: '',
      visitMode: undefined,
      consent: false,
      insuranceCarrier: undefined,
      firstName: '',
      lastName: '',
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const visitMode = watch('visitMode');
  const consent = watch('consent');

  // Use field registry to determine which fields to show
  const { shouldShowField } = useBookingFormFields({
    answeredValues: {
      [FieldId.PHONE]: preferences.phone,
      [FieldId.INSURANCE]: preferences.insurance,
      [FieldId.CONSENT]: preferences.consent,
    },
  });

  const showPhoneField = shouldShowField(FieldId.PHONE);
  const showInsuranceField = shouldShowField(FieldId.INSURANCE);
  const showConsentField = shouldShowField(FieldId.CONSENT);
  const showFirstNameField = shouldShowField(FieldId.FIRST_NAME);
  const showLastNameField = shouldShowField(FieldId.LAST_NAME);

  // Pre-fill from preferences
  useEffect(() => {
    if (preferences.phone) {
      setValue('phone', preferences.phone);
    }
    if (preferences.insurance) {
      setValue('insuranceCarrier', preferences.insurance);
      setInsuranceQuery(preferences.insurance);
    }
    if (preferences.consent === true) {
      setValue('consent', true);
    }
  }, [preferences.phone, preferences.insurance, preferences.consent, setValue]);

  // Set visit mode based on slot capabilities
  useEffect(() => {
    const modes = getSlotModes(selectedSlot);
    if (modes.inPerson && modes.virtual) {
      setValue('visitMode', undefined, { shouldValidate: true });
    } else if (modes.inPerson) {
      setValue('visitMode', 'In-Person', { shouldValidate: true });
    } else if (modes.virtual) {
      setValue('visitMode', 'Telehealth', { shouldValidate: true });
    } else {
      setValue('visitMode', undefined, { shouldValidate: true });
    }
  }, [selectedSlot, setValue]);

  // Scroll to form when mounted
  useEffect(() => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedSlot.eventId]);

  const selectedSlotSummary = useMemo((): SelectedSlotSummary => {
    const when = format(
      new Date(selectedSlot.slotstart),
      "EEE MMM d 'at' h:mm a"
    );
    const modes = getSlotModes(selectedSlot);
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

  const modes = getSlotModes(selectedSlot);
  const needsLocationChoice = modes.inPerson && modes.virtual;

  const canSubmit = useMemo(() => {
    if (!isValid) return false;
    if (needsLocationChoice && !visitMode) return false;
    if (
      bookingStatus === 'starting' ||
      bookingStatus === 'booking' ||
      bookingStatus === 'redirecting' ||
      isSubmitting
    )
      return false;
    return true;
  }, [isValid, needsLocationChoice, visitMode, bookingStatus, isSubmitting]);

  const handleClear = () => {
    reset();
    onResetWorkflow();
    onClearSlot();
  };

  return (
    <section
      ref={bookingFormRef}
      className='space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6'
    >
      <div>
        <h3 className='text-base font-semibold text-primary'>
          Complete your booking
        </h3>
        <div className='mt-2 inline-flex w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 sm:w-auto'>
          <div className='flex flex-col text-left'>
            <span className='font-medium'>{selectedSlotSummary.when}</span>
            <span className='text-[11px] text-slate-600'>
              {selectedSlotSummary.meta}
            </span>
          </div>
          <button
            type='button'
            onClick={handleClear}
            className='text-xs font-semibold text-primary hover:underline'
          >
            Clear
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* First Name */}
        {showFirstNameField && (
          <div className='space-y-1'>
            <Label htmlFor='firstName'>
              {FIELD_REGISTRY[FieldId.FIRST_NAME].label}
            </Label>
            <Controller
              name='firstName'
              control={form.control}
              render={({ field }) => (
                <Input
                  id='firstName'
                  autoComplete='given-name'
                  data-phi='true'
                  data-attr-redact='true'
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={FIELD_REGISTRY[FieldId.FIRST_NAME].placeholder}
                  className={
                    errors.firstName
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : undefined
                  }
                />
              )}
            />
            {errors.firstName && (
              <p className='text-xs font-medium text-red-600'>
                {errors.firstName.message}
              </p>
            )}
          </div>
        )}

        {/* Last Name */}
        {showLastNameField && (
          <div className='space-y-1'>
            <Label htmlFor='lastName'>
              {FIELD_REGISTRY[FieldId.LAST_NAME].label}
            </Label>
            <Controller
              name='lastName'
              control={form.control}
              render={({ field }) => (
                <Input
                  id='lastName'
                  autoComplete='family-name'
                  data-phi='true'
                  data-attr-redact='true'
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={FIELD_REGISTRY[FieldId.LAST_NAME].placeholder}
                  className={
                    errors.lastName
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : undefined
                  }
                />
              )}
            />
            {errors.lastName && (
              <p className='text-xs font-medium text-red-600'>
                {errors.lastName.message}
              </p>
            )}
          </div>
        )}

        {/* Phone */}
        {showPhoneField && (
          <div className='space-y-1'>
            <Label htmlFor='phone'>Mobile number</Label>
            <Controller
              name='phone'
              control={form.control}
              render={({ field }) => (
                <PhoneInput
                  id='phone'
                  data-phi
                  data-attr-redact
                  value={(field.value as E164Number) || undefined}
                  onChange={(value) => field.onChange(value ?? '')}
                  onBlur={field.onBlur}
                  className={
                    errors.phone
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : undefined
                  }
                  usOnly
                />
              )}
            />
            <p className='text-xs text-slate-500'>
              We'll use your phone number to confirm your appointment and send
              updates and reminders.
            </p>
            {errors.phone && (
              <p className='text-xs font-medium text-red-600'>
                {errors.phone.message}
              </p>
            )}
          </div>
        )}

        {/* Insurance */}
        {showInsuranceField && (
          <div className='space-y-1'>
            <Label htmlFor='insurance'>Insurance</Label>
            <Controller
              name='insuranceCarrier'
              control={form.control}
              render={({ field }) => {
                const filteredOptions = INSURANCE_OPTIONS.filter((option) =>
                  option.label
                    .toLowerCase()
                    .includes(insuranceQuery.toLowerCase())
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
              Please confirm your coverage. If you&apos;re not sure, you can
              leave this blank.
            </p>
          </div>
        )}

        {/* Visit Mode */}
        {(() => {
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
                          shouldValidate: true,
                        })
                      }
                      className='h-4 w-4 accent-primary'
                    />
                    <span>
                      In-person
                      {selectedSlot.facility
                        ? ` at ${selectedSlot.facility}`
                        : ''}
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
                          shouldValidate: true,
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
                This appointment will be{' '}
                <span className='font-semibold'>in-person</span>
                {selectedSlot.facility
                  ? ` at ${selectedSlot.facility}`
                  : ''}
                .
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

        {/* Consent */}
        {showConsentField && (
          <div className='space-y-1'>
            <label className='flex items-start gap-2 text-xs text-slate-700'>
              <input
                type='checkbox'
                checked={consent}
                onChange={(event) =>
                  setValue('consent', event.target.checked, {
                    shouldValidate: true,
                  })
                }
                className='mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary'
              />
              <span>
                I consent to receiving calls or text messages at this number
                about this appointment (not for marketing messages).
              </span>
            </label>
            {errors.consent && (
              <p className='text-xs font-medium text-red-600'>
                {errors.consent.message}
              </p>
            )}
          </div>
        )}

        <button
          type='submit'
          className='mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
          disabled={!canSubmit}
        >
          {bookingStatus === 'starting'
            ? 'Starting...'
            : bookingStatus === 'booking' || bookingStatus === 'redirecting'
              ? 'Booking...'
              : 'Continue'}
        </button>

        {bookingStatus === 'error' && !isModalOpen && (
          <div className='mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>
            {bookingError}
          </div>
        )}
      </form>
    </section>
  );
}



