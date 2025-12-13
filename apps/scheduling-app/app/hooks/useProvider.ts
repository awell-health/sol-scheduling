import { useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import type { GetProviderResponseType } from '../../../../packages/scheduler/dist/index.d.ts';
import { getProviderAction } from '../providers/actions';

export const useProvider = () => {
  const posthog = usePostHog();

  const fetchProvider = useCallback(
    async (providerId: string): Promise<GetProviderResponseType> => {
      const frontendStart = performance.now();
      try {
        const response = await getProviderAction(providerId);
        const frontendMs = Math.round(performance.now() - frontendStart);

        // Capture API timing in PostHog
        posthog?.capture('api_call_provider', {
          provider_id: providerId,
          frontend_rt_ms: frontendMs,
          sol_api_rt_ms: response._timing?.solApiMs,
        });

        return response;
      } catch (error) {
        const frontendMs = Math.round(performance.now() - frontendStart);
        posthog?.capture('api_call_provider_error', {
          provider_id: providerId,
          frontend_rt_ms: frontendMs,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        console.error('Error fetching provider:', error);
        throw error;
      }
    },
    [posthog]
  );

  return { fetchProvider };
};