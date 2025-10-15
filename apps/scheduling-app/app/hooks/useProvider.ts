import { useCallback } from 'react';
import type { GetProviderResponseType } from '../../../../packages/scheduler/dist/index.d.ts';

interface UseProviderConfig {
  baseUrl: string;
}

export const useProvider = ({ baseUrl }: UseProviderConfig) => {
  const fetchProvider = useCallback(
    async (providerId: string): Promise<GetProviderResponseType> => {
      try {
        const response = await fetch(`/api/sol/providers/${providerId}`, {
          headers: {
            'x-sol-api-url': baseUrl,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch provider ${providerId}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching provider:', error);
        throw error;
      }
    },
    [baseUrl]
  );

  return { fetchProvider };
};