'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LocationState,
  LocationStateToNameMapping,
  Modality,
  ProviderSearchFilters,
  ProviderSummary
} from './_lib/types';
import { SERVICE_PREFERENCE_STORAGE_KEY, STATE_PREFERENCE_STORAGE_KEY } from './_lib/preferences';
import { ProviderFilters } from './components/ProviderFilters';
import { ProviderCard } from './components/ProviderCard';
import { ProvidersEmptyState } from './components/ProvidersEmptyState';
import { getProvidersAction } from './actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';

const DEFAULT_FILTERS: ProviderSearchFilters = {
  age: '35',
};

const SERVICE_QUESTION_OPTIONS: {
  label: string;
  value: Modality;
  description: string;
}[] = [
  {
    label: 'Psychiatry',
    value: Modality.Psychiatric,
    description: 'Medication management and psychiatric support.'
  },
  {
    label: 'Therapy',
    value: Modality.Therapy,
    description: 'Talk therapy and ongoing emotional support.'
  },
  {
    label: 'Both',
    value: Modality.Both,
    description: 'A combination of psychiatric care and therapy.'
  },
  {
    label: 'Not sure',
    value: Modality.NotSure,
    description: 'Help deciding what type of care is right for you.'
  }
];

const ALL_US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'DC', name: 'Washington DC' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

const SUPPORTED_STATE_CODES = Object.keys(
  LocationStateToNameMapping
) as LocationState[];

const isSupportedStateCode = (code: string): code is LocationState =>
  SUPPORTED_STATE_CODES.includes(code as LocationState);

export function ProvidersPage() {
  const router = useRouter();
  const [pendingFilters, setPendingFilters] =
    useState<ProviderSearchFilters>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] =
    useState<ProviderSearchFilters>(DEFAULT_FILTERS);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceForPulse, setSelectedServiceForPulse] =
    useState<Modality | null>(null);
  const [selectedStateForPulse, setSelectedStateForPulse] =
    useState<string | null>(null);

  const syncPreferencesToStorage = (
    filters: ProviderSearchFilters | undefined
  ) => {
    if (typeof window === 'undefined') return;
    const modality = filters?.therapeuticModality;
    const stateCode = filters?.location?.state;

    if (modality) {
      window.localStorage.setItem(
        SERVICE_PREFERENCE_STORAGE_KEY,
        String(modality)
      );
    } else {
      window.localStorage.removeItem(SERVICE_PREFERENCE_STORAGE_KEY);
    }

    if (stateCode && isSupportedStateCode(stateCode)) {
      window.localStorage.setItem(STATE_PREFERENCE_STORAGE_KEY, stateCode);
    } else {
      window.localStorage.removeItem(STATE_PREFERENCE_STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedService = window.localStorage.getItem(
      SERVICE_PREFERENCE_STORAGE_KEY
    ) as Modality | null;

    const storedState = window.localStorage.getItem(
      STATE_PREFERENCE_STORAGE_KEY
    ) as string | null;

    if (!storedService && !storedState) return;

    setPendingFilters((prev) => ({
      ...prev,
      therapeuticModality: storedService ?? prev.therapeuticModality,
      location:
        storedState && isSupportedStateCode(storedState)
          ? ({
              ...(prev.location ?? {}),
              state: storedState
            } as ProviderSearchFilters['location'])
          : prev.location
    }));

    setActiveFilters((prev) => ({
      ...prev,
      therapeuticModality: storedService ?? prev.therapeuticModality,
      location:
        storedState && isSupportedStateCode(storedState)
          ? ({
              ...(prev.location ?? {}),
              state: storedState
            } as ProviderSearchFilters['location'])
          : prev.location
    }));
  }, []);

  useEffect(() => {
    if (
      !activeFilters.therapeuticModality ||
      !activeFilters.location?.state ||
      !isSupportedStateCode(activeFilters.location.state)
    ) {
      // Don't fetch providers until we have a service AND a supported state.
      setProviders([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProviders() {
      try {
        setLoading(true);
        setError(null);
        const response = await getProvidersAction(activeFilters);
        if (!cancelled) {
          setProviders(response.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load providers', err);
          setError(
            err instanceof Error ? err.message : 'Unable to load providers'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProviders();
    return () => {
      cancelled = true;
    };
  }, [activeFilters]);

  const listHeading = useMemo(() => {
    if (loading) return 'Searching for providers…';
    if (providers.length === 0) return 'No providers found';
    return `Showing ${providers.length} provider${
      providers.length === 1 ? '' : 's'
    }`;
  }, [loading, providers.length]);

  const handleSelectProvider = (providerId: string) => {
    router.push(`/providers/${providerId}`);
  };

  const handleFiltersSubmit = (nextValues?: ProviderSearchFilters) => {
    const filtersToApply = nextValues ?? pendingFilters;
    setActiveFilters(filtersToApply);
    syncPreferencesToStorage(filtersToApply);
  };

  const handleResetFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setActiveFilters(DEFAULT_FILTERS);
    syncPreferencesToStorage(DEFAULT_FILTERS);
  };

  const handleInitialServiceChoice = (modality: Modality) => {
    setSelectedServiceForPulse(modality);

    // Give a brief moment of visual feedback before advancing to the next step.
    window.setTimeout(() => {
      const nextFilters: ProviderSearchFilters = {
        ...pendingFilters,
        therapeuticModality: modality
      };

      setPendingFilters(nextFilters);
      setActiveFilters(nextFilters);
      syncPreferencesToStorage(nextFilters);
    }, 500);
  };

  const handleInitialStateChoice = (code: string) => {
    if (!code) return;

    setSelectedStateForPulse(code);

    window.setTimeout(() => {
      if (!isSupportedStateCode(code)) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STATE_PREFERENCE_STORAGE_KEY);
        }
        router.push(`/not-available?state=${encodeURIComponent(code)}`);
        return;
      }

      const nextFilters: ProviderSearchFilters = {
        ...pendingFilters,
        location: {
          facility: pendingFilters.location?.facility,
          state: code as LocationState
        }
      };

      setPendingFilters(nextFilters);
      setActiveFilters(nextFilters);
      syncPreferencesToStorage(nextFilters);
    }, 500);
  };

  const hasServiceSelection = Boolean(pendingFilters.therapeuticModality);
  const hasStateSelection = Boolean(pendingFilters.location?.state);

  return (
    <div className='flex min-h-[70vh] flex-col gap-2'>
      <header className='space-y-1'>
        <p className='text-sm font-semibold uppercase tracking-wide text-secondary-foreground'>
          SOL Mental Health
        </p>
        <h1 className='text-2xl md:text-3xl font-bold text-primary'>Find a provider</h1>
        <p className='max-w-2xl text-sm text-slate-600'>
          Browse licensed SOL providers and pick the appointment that works best
          for you.
        </p>
      </header>

      {!hasServiceSelection && (
        <section className='mt-4 flex flex-1 items-center'>
          <div className='w-full space-y-4 rounded-3xl border border-primary/10 bg-primary/5 px-3 py-4 shadow-sm md:space-y-6 md:px-10 md:py-10'>
            <div>
              <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
                What type of service are you looking for?
              </h2>
              <p className='mt-2 text-sm text-slate-700 md:mt-3 md:text-lg'>
                Choose the type of care that fits best right now. You can always
                change this later.
              </p>
            </div>
            <div className='grid gap-3 md:gap-4'>
              {SERVICE_QUESTION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition hover:border-primary hover:bg-primary/5 md:gap-4 md:px-6 md:py-5 md:text-base ${
                    selectedServiceForPulse === option.value
                      ? 'ring-2 ring-primary/30 animate-pulse'
                      : ''
                  }`}
                >
                  <input
                    type='radio'
                    name='initial-service'
                    value={option.value}
                    onChange={() => handleInitialServiceChoice(option.value)}
                    className='mt-1 h-5 w-5 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                  />
                  <div>
                    <p className='font-semibold'>{option.label}</p>
                    <p className='mt-1 text-xs text-slate-600 md:text-base'>
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasServiceSelection && !hasStateSelection && (
        <section className='mt-4 flex flex-1 items-center'>
          <div className='w-full space-y-4 rounded-3xl border border-primary/10 bg-primary/5 px-3 py-4 shadow-sm md:space-y-6 md:px-10 md:py-10'>
            <div>
              <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
                Which state are you in?
              </h2>
              <p className='mt-2 text-sm text-slate-700 md:mt-3 md:text-lg'>
                We&apos;ll show you providers who can see clients in your state.
              </p>
            </div>
            <div className='mx-auto max-w-sm'>
              <Select
                value={pendingFilters.location?.state ?? ''}
                onValueChange={handleInitialStateChoice}
              >
                <SelectTrigger
                  className={`h-12 text-base ${
                    selectedStateForPulse
                      ? 'ring-2 ring-primary/30 animate-pulse'
                      : ''
                  }`}
                >
                  <SelectValue placeholder='Select your state' />
                </SelectTrigger>
                <SelectContent>
                  {ALL_US_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      )}

      {hasServiceSelection && hasStateSelection && (
        <>
          <ProviderFilters
            values={pendingFilters}
            onChange={setPendingFilters}
            onSubmit={handleFiltersSubmit}
            isSubmitting={loading}
          />

          {error && (
            <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>
              {error}
            </div>
          )}

          <section className='space-y-4 pb-16 md:pb-0'>
            <div className='flex items-center justify-between'>
              <h2 className='text-base font-semibold text-primary'>
                {listHeading}
              </h2>
            </div>

            {loading ? (
              <div className='flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16'>
                <span className='text-sm text-slate-500'>Loading…</span>
              </div>
            ) : providers.length === 0 ? (
              <ProvidersEmptyState onReset={handleResetFilters} />
            ) : (
              <div className='flex flex-col gap-4'>
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onSelect={handleSelectProvider}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
