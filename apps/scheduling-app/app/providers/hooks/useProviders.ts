'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import {
  LocationState,
  LocationStateToNameMapping,
  Modality,
  ProviderSearchFilters,
  ProviderSummary,
} from '../_lib/types';
import {
  writePreferencesToStorage,
  type OnboardingPreferences,
} from '../_lib/onboarding';
import { getProvidersAction } from '../actions';

const DEFAULT_FILTERS: ProviderSearchFilters = {
  age: '35',
};

const LOCATION_STATE_CODES = Object.keys(
  LocationStateToNameMapping
) as LocationState[];

const isLocationState = (code: string): code is LocationState =>
  LOCATION_STATE_CODES.includes(code as LocationState);

/**
 * Filter message configuration.
 */
export type FilterMessageConfig = {
  condition: (filters: ProviderSearchFilters) => boolean;
  message: string;
  variant?: 'info' | 'warning' | 'success';
};

const FILTER_MESSAGES: FilterMessageConfig[] = [
  {
    condition: (filters) => filters.therapeuticModality === Modality.Both,
    message:
      "You've selected 'Both' service types. We recommend booking with psychiatry first, so we are showing those clinicians below. If you would like to start with therapy, please filter to 'Therapy' instead. Our team will ultimately help you schedule with both services either way.",
    variant: 'info',
  },
  {
    condition: (filters) => filters.therapeuticModality === Modality.NotSure,
    message:
      "You've selected 'Not Sure' for a service type. We recommend booking with psychiatry first, so we are showing those clinicians below. If you would like to start with therapy, please filter to 'Therapy' instead. Our team will ultimately help you schedule with both services either way.",
    variant: 'info',
  },
];

function getFilterMessage(
  filters: ProviderSearchFilters
): FilterMessageConfig | null {
  return FILTER_MESSAGES.find((config) => config.condition(filters)) ?? null;
}

interface UseProvidersOptions {
  preferences: OnboardingPreferences;
  isInitialized: boolean;
  isOnboardingComplete: boolean;
}

interface UseProvidersResult {
  // Filter state
  pendingFilters: ProviderSearchFilters;
  activeFilters: ProviderSearchFilters;
  setPendingFilters: (filters: ProviderSearchFilters) => void;

  // Provider data
  providers: ProviderSummary[];
  loading: boolean;
  error: string | null;

  // Handlers
  handleFiltersSubmit: (filters?: ProviderSearchFilters) => void;
  handleResetFilters: () => void;
  handleRetry: () => void;

  // Computed
  listHeading: string;
  filterMessage: FilterMessageConfig | null;
  missingRequiredFilters: string[];
}

/**
 * Hook to manage provider search state, filters, and data fetching.
 */
export function useProviders({
  preferences,
  isInitialized,
  isOnboardingComplete,
}: UseProvidersOptions): UseProvidersResult {
  const posthog = usePostHog();

  const [pendingFilters, setPendingFilters] =
    useState<ProviderSearchFilters>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] =
    useState<ProviderSearchFilters>(DEFAULT_FILTERS);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync onboarding preferences to filter state
  useEffect(() => {
    if (!isInitialized) return;

    const { state, service } = preferences;

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
    };

    setPendingFilters(nextFilters);
    setActiveFilters(nextFilters);
  }, [preferences, isInitialized]);

  // Sync filter changes back to storage
  useEffect(() => {
    if (!isInitialized || !isOnboardingComplete) return;

    const updates: Partial<{ state: string | null; service: string | null }> = {};

    const filterState = pendingFilters.location?.state;
    if (filterState !== preferences.state) {
      updates.state = filterState ?? null;
    }

    const filterService = pendingFilters.therapeuticModality;
    if (filterService !== preferences.service) {
      updates.service = filterService ?? null;
    }

    if (Object.keys(updates).length > 0) {
      writePreferencesToStorage(updates);
    }
  }, [
    pendingFilters.location?.state,
    pendingFilters.therapeuticModality,
    isInitialized,
    isOnboardingComplete,
    preferences.state,
    preferences.service,
  ]);

  // Fetch providers
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
  }, [activeFilters, isOnboardingComplete, posthog]);

  // Computed values
  const listHeading = useMemo(() => {
    if (loading) return 'Searching for providers…';
    if (providers.length === 0) return 'No providers found';
    return `Showing ${providers.length} provider${
      providers.length === 1 ? '' : 's'
    }`;
  }, [loading, providers.length]);

  const filterMessage = useMemo(
    () => getFilterMessage(activeFilters),
    [activeFilters]
  );

  const missingRequiredFilters = useMemo(() => {
    if (!isOnboardingComplete) return [];
    
    const missing: string[] = [];
    if (!activeFilters.therapeuticModality) {
      missing.push('Service type');
    }
    if (!activeFilters.location?.state || !isLocationState(activeFilters.location.state)) {
      missing.push('State');
    }
    return missing;
  }, [activeFilters, isOnboardingComplete]);

  // Handlers
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

  return {
    pendingFilters,
    activeFilters,
    setPendingFilters,
    providers,
    loading,
    error,
    handleFiltersSubmit,
    handleResetFilters,
    handleRetry,
    listHeading,
    filterMessage,
    missingRequiredFilters,
  };
}



