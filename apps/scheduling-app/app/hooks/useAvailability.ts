import { useCallback } from 'react';
import type { GetAvailabilitiesResponseType } from '../../../../packages/scheduler/dist/index.d.ts';

interface UseAvailabilityConfig {
  baseUrl: string;
}

// Helper function to transform slotstart from string to Date
const transformAvailabilityDates = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(slot => ({
      ...slot,
      slotstart: slot.slotstart ? new Date(slot.slotstart) : slot.slotstart
    }));
  }

  return data;
};

export const useAvailability = ({ baseUrl }: UseAvailabilityConfig) => {
  const fetchAvailability = useCallback(
    async (providerId: string): Promise<GetAvailabilitiesResponseType> => {
      try {
        const response = await fetch(`/api/sol/providers/${providerId}/availability`, {
          headers: {
            'x-sol-api-url': baseUrl,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch availability for provider ${providerId}: ${response.statusText}`);
        }

        const rawData = await response.json();

        // Transform date strings to Date objects
        const transformedData = {
          ...rawData,
          data: {
            ...rawData.data,
            [providerId]: transformAvailabilityDates(rawData.data?.[providerId])
          }
        };

        console.log('Availability data transformed:', {
          raw: rawData?.data?.[providerId]?.[0],
          transformed: transformedData?.data?.[providerId]?.[0]
        });

        return transformedData;
      } catch (error) {
        console.error('Error fetching availability:', error);
        throw error;
      }
    },
    [baseUrl]
  );

  return { fetchAvailability };
};