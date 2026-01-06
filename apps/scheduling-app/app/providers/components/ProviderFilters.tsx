'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
} from '../../../components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
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
  TimeOfTheDay,
} from '../_lib/types';
import { clearPreferencesStorage } from '../_lib/onboarding';
import { SERVICE_OPTIONS } from '../../../lib/fields/registry';
import { FilterPill, ActiveFilterTag, type FilterOption } from './filters';

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

// Helper to create options from enum
const enumOptions = <T extends string>(
  record: Record<string, T>
): FilterOption<T>[] =>
  Object.values(record).map((value) => ({
    label: value,
    value,
  }));

// State options
const stateOptions: FilterOption<LocationState>[] = Object.entries(
  LocationStateToNameMapping
).map(([state, label]) => ({
  label,
  value: state as LocationState,
}));

// Service options mapped from SERVICE_OPTIONS registry
const serviceOptions: FilterOption<Modality>[] = Object.values(Modality).map(
  (enumValue) => {
    const option = SERVICE_OPTIONS.find((opt) => opt.value === enumValue);
    return {
      label: option?.label ?? enumValue,
      value: enumValue as Modality,
    };
  }
);

// Other filter options
const deliveryOptions = enumOptions(DeliveryMethod);
const timeOfDayOptions = enumOptions(TimeOfTheDay);
const genderOptions: FilterOption<Gender>[] = [
  { label: 'Male', value: Gender.Male },
  { label: 'Female', value: Gender.Female },
  { label: 'Non-binary/non-conforming', value: Gender.NonBinaryOrNonConforming },
];
const languageOptions = enumOptions(Language);
const clinicalFocusOptions = enumOptions(ClinicalFocus);

export function ProviderFilters({
  values,
  onChange,
  onSubmit,
  isSubmitting,
}: ProviderFiltersProps) {
  const [activeDesktopFilter, setActiveDesktopFilter] =
    useState<DesktopFilterKey | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const selectedState = values.location?.state;

  // Facility options based on selected state
  const facilityOptions = useMemo(() => {
    if (!selectedState) return [];
    const prefix = `${selectedState} - `;
    return Object.values(LocationFacility)
      .filter((facility) => facility.startsWith(prefix))
      .map((facility) => ({
        label: facility.replace(prefix, ''),
        value: facility,
      }));
  }, [selectedState]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDesktopFilter(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Creates an onApply handler for a filter that updates state and submits
  const createApplyHandler = <T,>(
    buildNextValues: (val: T | undefined) => ProviderSearchFilters
  ) => {
    return (val: T | undefined) => {
      const next = buildNextValues(val);
      onChange(next);
      onSubmit(next);
      setActiveDesktopFilter(null);
    };
  };

  // For mobile drawer - updates pending state only (not submitted until Apply)
  const handleLocationChange = (updates: { state?: string; facility?: string }) => {
    const nextLocation = {
      ...(values.location ?? {}),
      ...updates,
    };
    onChange({
      ...values,
      location:
        !nextLocation.state && !nextLocation.facility
          ? undefined
          : (nextLocation as ProviderSearchFilters['location']),
    });
  };

  const handleMobileApply = () => {
    onSubmit();
    setIsMobileDrawerOpen(false);
  };

  // Count active filters for mobile badge
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

  // Build list of active filters for desktop tags
  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string; value: string; onClear: () => void }[] = [];

    if (values.location?.state) {
      const stateLabel = stateOptions.find((o) => o.value === values.location?.state)?.label ?? values.location.state;
      filters.push({
        key: 'state',
        label: 'State',
        value: stateLabel,
        onClear: () => createApplyHandler(() => ({ ...values, location: undefined }))(undefined),
      });
    }

    if (values.location?.facility) {
      const facilityLabel = facilityOptions.find((o) => o.value === values.location?.facility)?.label ?? values.location.facility;
      filters.push({
        key: 'facility',
        label: 'Facility',
        value: facilityLabel,
        onClear: () => createApplyHandler(() => ({
          ...values,
          location: values.location?.state
            ? ({ state: values.location.state, facility: undefined } as unknown as ProviderSearchFilters['location'])
            : undefined,
        }))(undefined),
      });
    }

    if (values.therapeuticModality) {
      const serviceLabel = serviceOptions.find((o) => o.value === values.therapeuticModality)?.label ?? values.therapeuticModality;
      filters.push({
        key: 'service',
        label: 'Service',
        value: serviceLabel,
        onClear: () => createApplyHandler(() => ({ ...values, therapeuticModality: undefined }))(undefined),
      });
    }

    if (values.deliveryMethod) {
      filters.push({
        key: 'delivery',
        label: 'Delivery',
        value: values.deliveryMethod,
        onClear: () => createApplyHandler(() => ({ ...values, deliveryMethod: undefined }))(undefined),
      });
    }

    if (values.timeOfTheDay) {
      filters.push({
        key: 'timeOfDay',
        label: 'Time of Day',
        value: values.timeOfTheDay,
        onClear: () => createApplyHandler(() => ({ ...values, timeOfTheDay: undefined }))(undefined),
      });
    }

    if (values.gender) {
      const genderLabel = genderOptions.find((o) => o.value === values.gender)?.label ?? values.gender;
      filters.push({
        key: 'gender',
        label: 'Gender',
        value: genderLabel,
        onClear: () => createApplyHandler(() => ({ ...values, gender: undefined }))(undefined),
      });
    }

    if (values.language) {
      filters.push({
        key: 'language',
        label: 'Language',
        value: values.language,
        onClear: () => createApplyHandler(() => ({ ...values, language: undefined }))(undefined),
      });
    }

    if (values.clinicalFocus && values.clinicalFocus.length > 0) {
      const focusLabel = values.clinicalFocus.length === 1
        ? values.clinicalFocus[0]
        : `${values.clinicalFocus.length} selected`;
      filters.push({
        key: 'clinicalFocus',
        label: 'Clinical Focus',
        value: focusLabel,
        onClear: () => createApplyHandler(() => ({ ...values, clinicalFocus: undefined }))(undefined),
      });
    }

    return filters;
  }, [values, stateOptions, facilityOptions, serviceOptions, genderOptions, createApplyHandler]);

  return (
    <div className='mb-4'>
      {/* Desktop filter bar */}
      <div className='hidden md:block'>
        <div className='flex justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm'>
          {/* State */}
          <FilterPill
            filterKey='state'
            label='State'
            options={stateOptions}
            value={values.location?.state as LocationState | undefined}
            onApply={createApplyHandler((val) => ({
              ...values,
              location: val
                ? ({ state: val as LocationState, facility: undefined } as unknown as ProviderSearchFilters['location'])
                : undefined,
            }))}
            isOpen={activeDesktopFilter === 'state'}
            onToggle={() =>
              setActiveDesktopFilter((c) => (c === 'state' ? null : 'state'))
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
          />

          {/* Facility */}
          <FilterPill
            filterKey='facility'
            label='Facility'
            options={facilityOptions}
            value={values.location?.facility}
            onApply={createApplyHandler((val) => ({
              ...values,
              location: values.location?.state
                ? ({ state: values.location.state, facility: val as LocationFacility | undefined } as unknown as ProviderSearchFilters['location'])
                : undefined,
            }))}
            isOpen={activeDesktopFilter === 'facility'}
            onToggle={() =>
              setActiveDesktopFilter((c) => (c === 'facility' ? null : 'facility'))
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
            disabled={!selectedState}
          />

          {/* Service */}
          <FilterPill
            filterKey='service'
            label='Service'
            options={serviceOptions}
            value={values.therapeuticModality as Modality | undefined}
            onApply={createApplyHandler((val) => ({ ...values, therapeuticModality: val as Modality | undefined }))}
            isOpen={activeDesktopFilter === 'service'}
            onToggle={() =>
              setActiveDesktopFilter((c) => (c === 'service' ? null : 'service'))
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
          />

          {/* Delivery */}
          <FilterPill
            filterKey='delivery'
            label='Delivery'
            options={deliveryOptions}
            value={values.deliveryMethod as DeliveryMethod | undefined}
            onApply={createApplyHandler((val) => ({ ...values, deliveryMethod: val as DeliveryMethod | undefined }))}
            isOpen={activeDesktopFilter === 'delivery'}
            onToggle={() =>
              setActiveDesktopFilter((c) => (c === 'delivery' ? null : 'delivery'))
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
          />

          {/* Time of Day */}
          <FilterPill
            filterKey='timeOfDay'
            label='Time of Day'
            options={timeOfDayOptions}
            value={values.timeOfTheDay as TimeOfTheDay | undefined}
            onApply={createApplyHandler((val) => ({ ...values, timeOfTheDay: val as TimeOfTheDay | undefined }))}
            isOpen={activeDesktopFilter === 'timeOfDay'}
            onToggle={() =>
              setActiveDesktopFilter((c) => (c === 'timeOfDay' ? null : 'timeOfDay'))
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
          />

          {/* Gender */}
          <FilterPill
            filterKey='gender'
            label='Gender'
            options={genderOptions}
            value={values.gender as Gender | undefined}
            onApply={createApplyHandler((val) => ({ ...values, gender: val as Gender | undefined }))}
            isOpen={activeDesktopFilter === 'gender'}
            onToggle={() =>
              setActiveDesktopFilter((c) => (c === 'gender' ? null : 'gender'))
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
          />

          {/* Clinical Focus */}
          <FilterPill
            filterKey='clinicalFocus'
            label='Clinical Focus'
            options={clinicalFocusOptions}
            value={values.clinicalFocus?.[0] as ClinicalFocus | undefined}
            onApply={createApplyHandler((val) => ({
              ...values,
              clinicalFocus: val ? [val as ClinicalFocus] : undefined,
            }))}
            isOpen={activeDesktopFilter === 'clinicalFocus'}
            onToggle={() =>
              setActiveDesktopFilter((c) =>
                c === 'clinicalFocus' ? null : 'clinicalFocus'
              )
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
          />

          {/* Language */}
          <FilterPill
            filterKey='language'
            label='Language'
            options={languageOptions}
            value={values.language as Language | undefined}
            onApply={createApplyHandler((val) => ({ ...values, language: val as Language | undefined }))}
            isOpen={activeDesktopFilter === 'language'}
            onToggle={() =>
              setActiveDesktopFilter((c) => (c === 'language' ? null : 'language'))
            }
            onClose={() => setActiveDesktopFilter(null)}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Active filter tags */}
        {activeFilters.length > 0 && (
          <div className='mt-3 flex flex-wrap gap-2'>
            {activeFilters.map((filter) => (
              <ActiveFilterTag
                key={filter.key}
                label={filter.label}
                value={filter.value}
                onClear={filter.onClear}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
        <div className='md:hidden'>
          {/* Closed state: filters button strip */}
          <DrawerTrigger asChild>
            <div className='fixed inset-x-0 bottom-0 z-40 mx-auto max-w-2xl px-4 pb-4'>
              <button
                type='button'
                className='flex w-full items-center justify-between rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-card'
              >
                <span>Filters</span>
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
              <div className='space-y-4'>
                {/* State */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>State</p>
                  <Select
                    value={values.location?.state ?? ''}
                    onValueChange={(val) =>
                      handleLocationChange({
                        state: val === CLEAR_VALUE ? undefined : val,
                        facility: undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a state' />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Facility */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>Facility</p>
                  <Select
                    value={values.location?.facility ?? ''}
                    onValueChange={(val) =>
                      handleLocationChange({
                        facility: val === CLEAR_VALUE ? undefined : val,
                      })
                    }
                    disabled={!selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedState ? 'All facilities' : 'Select a facility'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CLEAR_VALUE}>All facilities</SelectItem>
                      {facilityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Service */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>Service</p>
                  <Select
                    value={values.therapeuticModality ?? ''}
                    onValueChange={(val) =>
                      onChange({ ...values, therapeuticModality: val || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Choose a service' />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Delivery */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>Delivery</p>
                  <Select
                    value={values.deliveryMethod ?? ''}
                    onValueChange={(val) =>
                      onChange({
                        ...values,
                        deliveryMethod: val === CLEAR_VALUE ? undefined : val,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                      {deliveryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time of Day */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>Time of day</p>
                  <Select
                    value={values.timeOfTheDay ?? ''}
                    onValueChange={(val) =>
                      onChange({
                        ...values,
                        timeOfTheDay: val === CLEAR_VALUE ? undefined : val,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                      {timeOfDayOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>Gender</p>
                  <Select
                    value={values.gender ?? ''}
                    onValueChange={(val) =>
                      onChange({
                        ...values,
                        gender: val === CLEAR_VALUE ? undefined : val,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clinical Focus */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>
                    Clinical Focus
                  </p>
                  <Select
                    value={values.clinicalFocus?.[0] ?? ''}
                    onValueChange={(val) =>
                      onChange({
                        ...values,
                        clinicalFocus:
                          val === CLEAR_VALUE ? undefined : val ? [val] : undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                      {clinicalFocusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-600'>Language</p>
                  <Select
                    value={values.language ?? ''}
                    onValueChange={(val) =>
                      onChange({
                        ...values,
                        language: val === CLEAR_VALUE ? undefined : val,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CLEAR_VALUE}>Any</SelectItem>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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

                  onChange(cleared);
                  onSubmit(cleared);
                  clearPreferencesStorage();
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
