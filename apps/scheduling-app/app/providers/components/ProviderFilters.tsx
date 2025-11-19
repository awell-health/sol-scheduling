'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle
} from '../../../components/ui/drawer';
import {
  ClinicalFocus,
  DeliveryMethod,
  Gender,
  Language,
  LocationFacility,
  LocationState,
  LocationStateToNameMapping,
  Modality,
  ProviderSearchFilters,
  TimeOfTheDay
} from '../_lib/types';
import { clearSolPreferenceStorage } from '../_lib/preferences';

type ProviderFiltersProps = {
  values: ProviderSearchFilters;
  onChange: (nextValues: ProviderSearchFilters) => void;
  onSubmit: (nextValues?: ProviderSearchFilters) => void;
  isSubmitting: boolean;
};

type DesktopFilterKey =
  | 'state'
  | 'facility'
  | 'service'
  | 'delivery'
  | 'timeOfDay'
  | 'gender'
  | 'clinicalFocus'
  | 'language';

const CLEAR_VALUE = '__all';

const enumOptions = (record: Record<string, string>) =>
  Object.values(record).map((value) => ({
    label: value,
    value
  }));

const stateOptions = Object.entries(LocationStateToNameMapping).map(
  ([state, label]) => ({
    label,
    value: state as LocationState
  })
);

const serviceOptions = Object.values(Modality).map((value) => ({
  label: value,
  value
}));

const deliveryOptions = Object.values(DeliveryMethod).map((value) => ({
  label: value,
  value
}));

const timeOfDayOptions = Object.values(TimeOfTheDay).map((value) => ({
  label: value,
  value
}));

const genderOptions = [
  { label: 'Male', value: Gender.Male },
  { label: 'Female', value: Gender.Female },
  { label: 'Non-binary/non-conforming', value: Gender.NonBinaryOrNonConforming }
];

const languageOptions = enumOptions(Language);

const clinicalFocusOptions = enumOptions(ClinicalFocus);

const basePillClasses =
  'inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20';

export function ProviderFilters({
  values,
  onChange,
  onSubmit,
  isSubmitting
}: ProviderFiltersProps) {
  const [activeDesktopFilter, setActiveDesktopFilter] =
    useState<DesktopFilterKey | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const selectedState = values.location?.state;

  const facilityOptions = useMemo(() => {
    if (!selectedState) {
      return [];
    }

    const prefix = `${selectedState} - `;

    return Object.values(LocationFacility)
      .filter((facility) => facility.startsWith(prefix))
      .map((facility) => ({
        label: facility.replace(prefix, ''),
        value: facility
      }));
  }, [selectedState]);

  const updateFilters = (next: ProviderSearchFilters) => {
    onChange(next);
  };

  const handleLocationChange = (updates: {
    state?: string;
    facility?: string;
  }) => {
    const nextLocation = {
      ...(values.location ?? {}),
      ...updates
    };

    updateFilters({
      ...values,
      location:
        !nextLocation.state && !nextLocation.facility
          ? undefined
          : (nextLocation as ProviderSearchFilters['location'])
    });
  };

  const toggleClinicalFocus = (value: string) => {
    const current = values.clinicalFocus ?? [];
    const exists = current.includes(value);
    const next = exists
      ? current.filter((item: string) => item !== value)
      : [...current, value];

    updateFilters({
      ...values,
      clinicalFocus: next.length > 0 ? next : undefined
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (values.location?.state) count += 1;
    if (values.location?.facility) count += 1;
    if (values.therapeuticModality) count += 1;
    if (values.deliveryMethod) count += 1;
    if (values.timeOfTheDay) count += 1;
    if (values.gender) count += 1;
    if (values.language) count += 1;
    if (values.clinicalFocus && values.clinicalFocus.length > 0) count += 1;
    return count;
  }, [values]);

  const getSingleSelectLabel = <T extends string>(
    options: { value: T; label: string }[],
    value: T | undefined,
    fallback: string
  ) => {
    if (!value) return fallback;
    const match = options.find((option) => option.value === value);
    return match?.label ?? fallback;
  };

  const clinicalFocusLabel = useMemo(() => {
    const selected = values.clinicalFocus ?? [];
    if (selected.length === 0) return 'Clinical focus';
    if (selected.length === 1) {
      const match = clinicalFocusOptions.find(
        (option) => option.value === selected[0]
      );
      return match?.label ?? 'Clinical focus';
    }
    return `Clinical focus · ${selected.length}`;
  }, [values.clinicalFocus]);

  const pillClasses = (key: DesktopFilterKey, isActive: boolean) =>
    clsx(
      basePillClasses,
      activeDesktopFilter === key
        ? 'border-primary bg-primary text-primary-foreground shadow-card'
        : isActive
          ? 'border-secondary bg-secondary text-secondary-foreground'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
    );

  const handleDesktopApply = () => {
    onSubmit();
    setActiveDesktopFilter(null);
  };

  const handleDesktopClear = (key: DesktopFilterKey) => {
    if (key === 'state') {
      const next = {
        ...values,
        location: undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
      return;
    }

    if (key === 'facility') {
      const next = {
        ...values,
        location: values.location
          ? ({
              ...values.location,
              facility: undefined
            } as ProviderSearchFilters['location'])
          : undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
      return;
    }

    if (key === 'service') {
      const next = {
        ...values,
        therapeuticModality: undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
      return;
    }

    if (key === 'delivery') {
      const next = {
        ...values,
        deliveryMethod: undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
      return;
    }

    if (key === 'timeOfDay') {
      const next = {
        ...values,
        timeOfTheDay: undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
      return;
    }

    if (key === 'gender') {
      const next = {
        ...values,
        gender: undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
      return;
    }

    if (key === 'language') {
      const next = {
        ...values,
        language: undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
      return;
    }

    if (key === 'clinicalFocus') {
      const next = {
        ...values,
        clinicalFocus: undefined
      };
      updateFilters(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
    }
  };

  const handleMobileApply = () => {
    onSubmit();
    setIsMobileDrawerOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDesktopFilter(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='mb-4'>
      {/* Desktop filter bar */}
      <div className='hidden md:block'>
        <div className='flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm'>
          {/* State */}
          <div className='relative'>
            <button
              type='button'
              className={pillClasses('state', Boolean(values.location?.state))}
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'state' ? null : 'state'
                )
              }
            >
              {getSingleSelectLabel(
                stateOptions,
                values.location?.state as LocationState | undefined,
                'State'
              )}
            </button>
            {activeDesktopFilter === 'state' && (
              <div className='absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='max-h-64 space-y-2 overflow-y-auto text-sm'>
                  {stateOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 text-slate-700'
                    >
                      <input
                        type='radio'
                        name='state'
                        value={option.value}
                        checked={values.location?.state === option.value}
                        onChange={() =>
                          handleLocationChange({
                            state: option.value,
                            facility: undefined
                          })
                        }
                        className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('state')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Facility */}
          <div className='relative'>
            <button
              type='button'
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'facility' ? null : 'facility'
                )
              }
              disabled={!selectedState}
              className={clsx(
                pillClasses('facility', Boolean(values.location?.facility)),
                !selectedState &&
                  'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 shadow-none hover:bg-slate-50'
              )}
            >
              {values.location?.facility
                ? getSingleSelectLabel(
                    facilityOptions,
                    values.location.facility,
                    'Facility'
                  )
                : 'Facility'}
            </button>
            {activeDesktopFilter === 'facility' && (
              <div className='absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='max-h-64 space-y-2 overflow-y-auto text-sm'>
                  {facilityOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 text-slate-700'
                    >
                      <input
                        type='radio'
                        name='facility'
                        value={option.value}
                        checked={values.location?.facility === option.value}
                        onChange={() =>
                          handleLocationChange({ facility: option.value })
                        }
                        className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('facility')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Service */}
          <div className='relative'>
            <button
              type='button'
              className={pillClasses(
                'service',
                Boolean(values.therapeuticModality)
              )}
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'service' ? null : 'service'
                )
              }
            >
              {getSingleSelectLabel(
                serviceOptions,
                values.therapeuticModality ?? undefined,
                'Service'
              )}
            </button>
            {activeDesktopFilter === 'service' && (
              <div className='absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='max-h-64 space-y-2 overflow-y-auto text-sm'>
                  {serviceOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 text-slate-700'
                    >
                      <input
                        type='radio'
                        name='service'
                        value={option.value}
                        checked={values.therapeuticModality === option.value}
                        onChange={() =>
                          updateFilters({
                            ...values,
                            therapeuticModality: option.value
                          })
                        }
                        className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('service')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delivery */}
          <div className='relative'>
            <button
              type='button'
              className={pillClasses(
                'delivery',
                Boolean(values.deliveryMethod)
              )}
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'delivery' ? null : 'delivery'
                )
              }
            >
              {getSingleSelectLabel(
                deliveryOptions,
                values.deliveryMethod ?? undefined,
                'Delivery'
              )}
            </button>
            {activeDesktopFilter === 'delivery' && (
              <div className='absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='max-h-64 space-y-2 overflow-y-auto text-sm'>
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 text-slate-700'
                    >
                      <input
                        type='radio'
                        name='delivery'
                        value={option.value}
                        checked={values.deliveryMethod === option.value}
                        onChange={() =>
                          updateFilters({
                            ...values,
                            deliveryMethod: option.value
                          })
                        }
                        className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('delivery')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Time of day */}
          <div className='relative'>
            <button
              type='button'
              className={pillClasses(
                'timeOfDay',
                Boolean(values.timeOfTheDay)
              )}
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'timeOfDay' ? null : 'timeOfDay'
                )
              }
            >
              {getSingleSelectLabel(
                timeOfDayOptions,
                values.timeOfTheDay ?? undefined,
                'Time of day'
              )}
            </button>
            {activeDesktopFilter === 'timeOfDay' && (
              <div className='absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='max-h-64 space-y-2 overflow-y-auto text-sm'>
                  {timeOfDayOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 text-slate-700'
                    >
                      <input
                        type='radio'
                        name='timeOfDay'
                        value={option.value}
                        checked={values.timeOfTheDay === option.value}
                        onChange={() =>
                          updateFilters({
                            ...values,
                            timeOfTheDay: option.value
                          })
                        }
                        className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('timeOfDay')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className='relative'>
            <button
              type='button'
              className={pillClasses('gender', Boolean(values.gender))}
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'gender' ? null : 'gender'
                )
              }
            >
              {getSingleSelectLabel(
                genderOptions,
                values.gender ?? undefined,
                'Gender'
              )}
            </button>
            {activeDesktopFilter === 'gender' && (
              <div className='absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='space-y-2 text-sm'>
                  {genderOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 text-slate-700'
                    >
                      <input
                        type='radio'
                        name='gender'
                        value={option.value}
                        checked={values.gender === option.value}
                        onChange={() =>
                          updateFilters({
                            ...values,
                            gender: option.value
                          })
                        }
                        className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('gender')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clinical focus */}
          <div className='relative'>
            <button
              type='button'
              className={pillClasses(
                'clinicalFocus',
                Boolean(values.clinicalFocus && values.clinicalFocus.length > 0)
              )}
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'clinicalFocus' ? null : 'clinicalFocus'
                )
              }
            >
              {clinicalFocusLabel}
            </button>
            {activeDesktopFilter === 'clinicalFocus' && (
              <div className='absolute right-0 z-30 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='max-h-72 space-y-2 overflow-y-auto text-sm'>
                  {clinicalFocusOptions.map((option) => {
                    const checked =
                      values.clinicalFocus?.includes(option.value) ?? false;
                    return (
                      <label
                        key={option.value}
                        className='flex items-center gap-2 text-slate-700'
                      >
                        <input
                          type='checkbox'
                          value={option.value}
                          checked={checked}
                          onChange={() => toggleClinicalFocus(option.value)}
                            className='h-4 w-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/30'
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('clinicalFocus')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language */}
          <div className='relative'>
            <button
              type='button'
              className={pillClasses('language', Boolean(values.language))}
              onClick={() =>
                setActiveDesktopFilter((current) =>
                  current === 'language' ? null : 'language'
                )
              }
            >
              {getSingleSelectLabel(
                languageOptions,
                values.language ?? undefined,
                'Language'
              )}
            </button>
            {activeDesktopFilter === 'language' && (
              <div className='absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
                <div className='max-h-64 space-y-2 overflow-y-auto text-sm'>
                  {languageOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 text-slate-700'
                    >
                      <input
                        type='radio'
                        name='language'
                        value={option.value}
                        checked={values.language === option.value}
                        onChange={() =>
                          updateFilters({
                            ...values,
                            language: option.value
                          })
                        }
                        className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-between text-sm'>
                  <button
                    type='button'
                    onClick={() => handleDesktopClear('language')}
                    className='text-slate-500 hover:text-slate-700'
                  >
                    Clear
                  </button>
                  <button
                    type='button'
                    onClick={handleDesktopApply}
                    disabled={isSubmitting}
                    className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
                  >
                    {isSubmitting ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer-style filters (Vaul / shadcn Drawer) */}
      <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
        <div className='md:hidden'>
          {/* Closed state: filters button strip */}
          <DrawerTrigger asChild>
            <div className='fixed inset-x-0 bottom-0 z-40 mx-auto max-w-2xl px-4 pb-4'>
              <button
                type='button'
                className='flex w-full items-center justify-between rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-card'
              >
                <span>
                  Filters
                </span>
                {activeFiltersCount > 0 && (
                  <span className='rounded-full bg-primary-foreground/10 px-2 py-0.5 text-xs font-medium'>
                    {activeFiltersCount} active
                  </span>
                )}
              </button>
            </div>
          </DrawerTrigger>

          {/* Open state: bottom sheet with filters */}
          <DrawerContent className='mx-auto h-[85vh] max-w-2xl'>
            <DrawerHeader>
              <DrawerTitle className='sr-only'>Filters</DrawerTitle>
              <span className='text-sm font-semibold text-slate-800'>Filters</span>
              <button
                type='button'
                onClick={() => setIsMobileDrawerOpen(false)}
                className='text-sm font-medium text-slate-500 hover:text-slate-700'
              >
                Close
              </button>
            </DrawerHeader>

            <div className='flex-1 overflow-y-auto px-4 py-3 space-y-4'>
                  <div className='space-y-3'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        State
                      </p>
                      <Select
                        value={values.location?.state ?? ''}
                        onValueChange={(value) => {
                          const nextState =
                            value === CLEAR_VALUE ? undefined : value;
                          handleLocationChange({
                            state: nextState,
                            facility:
                              nextState &&
                              values.location?.facility?.startsWith(nextState)
                                ? values.location.facility
                                : undefined
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder='All states'
                            aria-label='All states'
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CLEAR_VALUE}>All states</SelectItem>
                          {stateOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        Facility
                      </p>
                      <Select
                        value={values.location?.facility ?? ''}
                        onValueChange={(value) =>
                          handleLocationChange({
                            facility:
                              value === CLEAR_VALUE ? undefined : value
                          })
                        }
                        disabled={!selectedState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedState ? 'All facilities' : 'Select a state'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CLEAR_VALUE}>
                            All facilities
                          </SelectItem>
                          {facilityOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        Service
                      </p>
                      <Select
                        value={values.therapeuticModality ?? ''}
                        onValueChange={(value) =>
                          updateFilters({
                            ...values,
                            therapeuticModality: value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Choose a service' />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        Delivery
                      </p>
                      <Select
                        value={values.deliveryMethod ?? ''}
                        onValueChange={(value) =>
                          updateFilters({
                            ...values,
                            deliveryMethod:
                              value === CLEAR_VALUE ? undefined : value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Any' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                          {deliveryOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        Time of day
                      </p>
                      <Select
                        value={values.timeOfTheDay ?? ''}
                        onValueChange={(value) =>
                          updateFilters({
                            ...values,
                            timeOfTheDay:
                              value === CLEAR_VALUE ? undefined : value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Any' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                          {timeOfDayOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        Gender
                      </p>
                      <Select
                        value={values.gender ?? ''}
                        onValueChange={(value) =>
                          updateFilters({
                            ...values,
                            gender: value === CLEAR_VALUE ? undefined : value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Any' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                          {genderOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        Clinical focus
                      </p>
                      <div className='max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-25 px-3 py-2'>
                        {clinicalFocusOptions.map((option) => {
                          const checked =
                            values.clinicalFocus?.includes(option.value) ??
                            false;
                          return (
                            <label
                              key={option.value}
                              className='flex items-center gap-2 text-sm text-slate-700'
                            >
                              <input
                                type='checkbox'
                                value={option.value}
                                checked={checked}
                                onChange={() => toggleClinicalFocus(option.value)}
                                className='h-4 w-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/30'
                              />
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-slate-600'>
                        Language
                      </p>
                      <Select
                        value={values.language ?? ''}
                        onValueChange={(value) =>
                          updateFilters({
                            ...values,
                            language: value === CLEAR_VALUE ? undefined : value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Any' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                          {languageOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

            <DrawerFooter className='text-sm'>
              <button
                type='button'
                onClick={() => {
                  const cleared = {
                    ...values,
                    location: undefined,
                    therapeuticModality: undefined,
                    deliveryMethod: undefined,
                    timeOfTheDay: undefined,
                    gender: undefined,
                    clinicalFocus: undefined,
                    language: undefined
                  } as ProviderSearchFilters;

                  updateFilters(cleared);
                  onSubmit(cleared);
                  clearSolPreferenceStorage();
                }}
                className='text-slate-500 hover:text-slate-700'
              >
                Clear all
              </button>
              <button
                type='button'
                onClick={handleMobileApply}
                disabled={isSubmitting}
                className='ml-auto rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
              >
                {isSubmitting ? 'Applying…' : 'Apply filters'}
              </button>
            </DrawerFooter>
          </DrawerContent>
        </div>
      </Drawer>
    </div>
  );
}
