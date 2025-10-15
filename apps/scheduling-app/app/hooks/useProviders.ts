import { useCallback } from 'react';
import type {
  GetProvidersInputType,
  GetProvidersResponseType
} from '../../../../packages/scheduler/dist/index.d.ts';

interface UseProvidersConfig {
  baseUrl: string;
}

export const useProviders = ({ baseUrl }: UseProvidersConfig) => {
  const fetchProviders = useCallback(
    async (prefs: GetProvidersInputType): Promise<GetProvidersResponseType> => {
      try {
        const response = await fetch('/api/sol/providers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-sol-api-url': baseUrl,
          },
          body: JSON.stringify({ input: prefs }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch providers: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
      }
    },
    [baseUrl]
  );

  return { fetchProviders };
};