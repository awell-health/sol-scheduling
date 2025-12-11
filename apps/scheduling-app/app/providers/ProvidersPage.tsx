'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import {
  LocationState,
  LocationStateToNameMapping,
  Modality,
  ProviderSearchFilters,
  ProviderSummary
} from './_lib/types';
import {
  useOnboarding,
  useBuildUrlWithReturn
} from './_lib/onboarding';
import { ProviderFilters } from './components/ProviderFilters';
import { ProviderCard } from './components/ProviderCard';
import { ProvidersEmptyState } from './components/ProvidersEmptyState';
import { getProvidersAction } from './actions';

const DEFAULT_FILTERS: ProviderSearchFilters = {
  age: '35'
};

const LOCATION_STATE_CODES = Object.keys(
  LocationStateToNameMapping
) as LocationState[];

const isLocationState = (code: string): code is LocationState =>
  LOCATION_STATE_CODES.includes(code as LocationState);

export function ProvidersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const posthog = usePostHog();
  const {
    preferences,
    isOnboardingComplete,
    isInitialized,
    returnUrl
  } = useOnboarding();
  const buildUrlWithReturn = useBuildUrlWithReturn();

  const [pendingFilters, setPendingFilters] =
    useState<ProviderSearchFilters>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] =
    useState<ProviderSearchFilters>(DEFAULT_FILTERS);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to onboarding if not complete
  useEffect(() => {
    if (isInitialized && !isOnboardingComplete) {
      router.replace(`/onboarding?target=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isOnboardingComplete, pathname, router]);

  // Sync onboarding preferences to filter state when context changes
  useEffect(() => {
    if (!isInitialized) return;

    const { state, service, insurance: _insurance } = preferences;

    // Map service string to Modality enum
    let modality: Modality | undefined;
    if (service) {
      const modalityValues = Object.values(Modality);
      if (modalityValues.includes(service as Modality)) {
        modality = service as Modality;
      }
    }

    // Build location filter if state is valid
    let location: ProviderSearchFilters['location'] | undefined;
    if (state && isLocationState(state)) {
      location = { state: state as LocationState } as ProviderSearchFilters['location'];
    }

    const nextFilters: ProviderSearchFilters = {
      ...DEFAULT_FILTERS,
      ...(modality ? { therapeuticModality: modality } : {}),
      ...(location ? { location } : {}),
      // Insurance can be used for filtering in the future
      // For now, we just keep it in preferences
    };

    setPendingFilters(nextFilters);
    setActiveFilters(nextFilters);
  }, [preferences, isInitialized]);

  // Fetch providers when onboarding is complete and filters are set
  useEffect(() => {
    if (!isOnboardingComplete) {
      setProviders([]);
      setLoading(false);
      return;
    }

    if (
      !activeFilters.therapeuticModality ||
      !activeFilters.location?.state ||
      !isLocationState(activeFilters.location.state)
    ) {
      setProviders([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProviders() {
      const frontendStart = performance.now();
      try {
        setLoading(true);
        setError(null);
        const response = await getProvidersAction(activeFilters);
        const frontendMs = Math.round(performance.now() - frontendStart);
        
        if (!cancelled) {
          setProviders(response.data ?? []);
          
          // Capture API timing in PostHog
          posthog?.capture('api_call_providers', {
            frontend_rt_ms: frontendMs,
            sol_api_rt_ms: response._timing?.solApiMs,
            provider_count: response._meta?.providerCount,
            filters: response._meta?.filters,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load providers', err);
          setError(
            err instanceof Error ? err.message : 'Unable to load providers'
          );
          
          // Capture error timing
          const frontendMs = Math.round(performance.now() - frontendStart);
          posthog?.capture('api_call_providers_error', {
            frontend_rt_ms: frontendMs,
            error: err instanceof Error ? err.message : 'Unknown error',
            filters: activeFilters,
          });
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
  }, [activeFilters, isOnboardingComplete]);

  const listHeading = useMemo(() => {
    if (loading) return 'Searching for providers…';
    if (providers.length === 0) return 'No providers found';
    return `Showing ${providers.length} provider${
      providers.length === 1 ? '' : 's'
    }`;
  }, [loading, providers.length]);

  const handleSelectProvider = (providerId: string) => {
    const url = buildUrlWithReturn(`/providers/${providerId}`);
    router.push(url);
  };

  const handleFiltersSubmit = (nextValues?: ProviderSearchFilters) => {
    const filtersToApply = nextValues ?? pendingFilters;
    setActiveFilters(filtersToApply);
  };

  const handleResetFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setActiveFilters(DEFAULT_FILTERS);
  };

  const handleRetry = () => {
    setError(null);
    setActiveFilters((previous) => ({ ...previous }));
  };

  // Show loading state until context is initialized or during redirect
  if (!isInitialized || !isOnboardingComplete) {
    return (
      <div className='flex flex-col gap-2'>
        <header className='space-y-1'>
          <h1 className='text-2xl font-bold text-primary md:text-3xl'>
            Find a provider
          </h1>
          <p className='max-w-2xl text-sm text-slate-600'>
            Browse licensed SOL providers and pick the appointment that works
            best for you.
          </p>
        </header>
        <div className='mt-8 flex items-center justify-center'>
          <span className='text-sm text-slate-500'>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <header className='mb-2 space-y-1'>
        <h1 className='text-2xl font-bold text-primary md:text-3xl'>
          Find a provider
        </h1>
        <p className='max-w-2xl text-sm text-slate-600'>
          Browse licensed SOL providers and pick the appointment that works best
          for you.
        </p>
      </header>

      {/* Show provider list when onboarding is complete */}
      {isOnboardingComplete && (
        <>
          <ProviderFilters
            values={pendingFilters}
            onChange={setPendingFilters}
            onSubmit={handleFiltersSubmit}
            isSubmitting={loading}
          />

          {error && (
            <div className='mt-2 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 md:flex-row md:items-center md:justify-between'>
              <p className='md:max-w-xl'>
                We&apos;re sorry, but something isn&apos;t working right 😅.
                Please try again in a moment.
              </p>
              <button
                type='button'
                onClick={handleRetry}
                className='inline-flex h-9 items-center justify-center rounded-md bg-amber-700 px-4 text-xs font-semibold text-amber-50 shadow-sm transition hover:bg-amber-800'
              >
                Try again
              </button>
            </div>
          )}

          {!error && (
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
                      returnUrl={returnUrl ?? undefined}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
