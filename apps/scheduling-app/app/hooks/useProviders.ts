import { useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { getProvidersAction } from '../providers/actions';
import type { ProviderSearchFilters } from '../providers/_lib/types';

export const useProviders = () => {
  const posthog = usePostHog();

  const fetchProviders = useCallback(
    async (prefs: ProviderSearchFilters | Record<string, unknown>) => {
      const frontendStart = performance.now();
      try {
        const response = await getProvidersAction(prefs);
        const frontendMs = Math.round(performance.now() - frontendStart);

        // Capture API timing in PostHog
        posthog?.capture('api_call_providers', {
          frontend_rt_ms: frontendMs,
          sol_api_rt_ms: response._timing?.solApiMs,
          provider_count: response._meta?.providerCount,
          filters: response._meta?.filters,
        });

        return response;
      } catch (error) {
        const frontendMs = Math.round(performance.now() - frontendStart);
        posthog?.capture('api_call_providers_error', {
          frontend_rt_ms: frontendMs,
          error: error instanceof Error ? error.message : 'Unknown error',
          filters: prefs,
        });
        console.error('Error fetching providers:', error);
        throw error;
      }
    },
    [posthog]
  );

  return { fetchProviders };
};