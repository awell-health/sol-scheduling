'use client';

import { useEffect, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { ProviderSummary } from '../../_lib/types';
import { getProviderAction } from '../../actions';

export interface UseProviderResult {
  provider: ProviderSummary | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage provider data.
 */
export function useProvider(providerId: string): UseProviderResult {
  const posthog = usePostHog();
  const [provider, setProvider] = useState<ProviderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProvider() {
      const frontendStart = performance.now();
      try {
        setLoading(true);
        setError(null);
        const response = await getProviderAction(providerId);
        const frontendMs = Math.round(performance.now() - frontendStart);

        if (!cancelled) {
          setProvider(response.data as ProviderSummary);

          posthog?.capture('api_call_provider', {
            provider_id: providerId,
            frontend_rt_ms: frontendMs,
            sol_api_rt_ms: response._timing?.solApiMs
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load provider details'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProvider();
    return () => {
      cancelled = true;
    };
  }, [providerId, posthog]);

  return { provider, loading, error };
}
