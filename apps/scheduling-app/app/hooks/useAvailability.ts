import { useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import type { GetAvailabilitiesResponseType } from '../../../../packages/scheduler/dist/index.d.ts';
import { getAvailabilityAction } from '../providers/actions';

// Helper function to transform slotstart from string to Date
const transformAvailabilityDates = (data: GetAvailabilitiesResponseType['data'][string]): GetAvailabilitiesResponseType['data'][string] => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(slot => ({
      ...slot,
      slotstart: slot.slotstart ? new Date(slot.slotstart) : slot.slotstart
    }));
  }

  return data;
};

export const useAvailability = () => {
  const posthog = usePostHog();

  const fetchAvailability = useCallback(
    async (providerId: string): Promise<GetAvailabilitiesResponseType> => {
      const frontendStart = performance.now();
      try {
        const rawData = await getAvailabilityAction(providerId);
        const frontendMs = Math.round(performance.now() - frontendStart);

        // Transform date strings to Date objects
        const transformedData = {
          ...rawData,
          data: {
            ...rawData.data,
            [providerId]: transformAvailabilityDates(rawData.data?.[providerId])
          }
        };

        const slotCount = rawData.data?.[providerId]?.length ?? 0;

        // Capture API timing in PostHog
        posthog?.capture('api_call_availability', {
          provider_id: providerId,
          frontend_rt_ms: frontendMs,
          sol_api_rt_ms: rawData._timing?.solApiMs,
          slot_count: slotCount,
        });

        return transformedData;
      } catch (error) {
        const frontendMs = Math.round(performance.now() - frontendStart);
        posthog?.capture('api_call_availability_error', {
          provider_id: providerId,
          frontend_rt_ms: frontendMs,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        console.error('Error fetching availability:', error);
        throw error;
      }
    },
    [posthog]
  );

  return { fetchAvailability };
};