import { useCallback } from 'react';
import type { SlotWithConfirmedLocation } from '../../../../packages/scheduler/dist/index.d.ts';
import type { SalesforcePreferencesType } from '../../../../packages/scheduler/dist/lib/utils/preferences';

export const useCompleteActivity = () => {
  const onCompleteActivity = useCallback(
    async (
      slot: SlotWithConfirmedLocation,
      preferences: SalesforcePreferencesType
    ) => {
      // In a real app, this would submit to your backend
      console.log('Activity completed:', {
        eventId: slot.eventId,
        providerId: slot.providerId,
        patientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        providerPreferences: JSON.stringify(preferences),
      });

      // For now, just return a success response
      return Promise.resolve({ data: { success: true } });
    },
    []
  );

  return { onCompleteActivity };
};