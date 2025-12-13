import { useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import type {
  BookAppointmentResponseType,
  SlotWithConfirmedLocation
} from '../../../../packages/scheduler/dist/index.d.ts';
import { bookAppointmentAction } from '../providers/actions';

interface UseBookingConfig {
  patientName: string;
  salesforceLeadId?: string;
}

export const useBooking = ({ patientName, salesforceLeadId }: UseBookingConfig) => {
  const posthog = usePostHog();

  const onBooking = useCallback(
    async (slot: SlotWithConfirmedLocation): Promise<BookAppointmentResponseType> => {
      const frontendStart = performance.now();
      try {
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const response = await bookAppointmentAction({
          eventId: slot.eventId,
          providerId: slot.providerId,
          userInfo: {
            userName: patientName,
            ...(salesforceLeadId ? { salesforceLeadId } : {}),
          },
          locationType: slot.confirmedLocation,
          patientTimezone: browserTimezone,
        });
        const frontendMs = Math.round(performance.now() - frontendStart);

        // Capture API timing in PostHog
        posthog?.capture('api_call_booking', {
          provider_id: slot.providerId,
          frontend_rt_ms: frontendMs,
          sol_api_rt_ms: response._timing?.solApiMs,
          location_type: slot.confirmedLocation,
        });

        return response;
      } catch (error) {
        const frontendMs = Math.round(performance.now() - frontendStart);
        posthog?.capture('api_call_booking_error', {
          provider_id: slot.providerId,
          frontend_rt_ms: frontendMs,
          error: error instanceof Error ? error.message : 'Unknown error',
          location_type: slot.confirmedLocation,
        });
        console.error('Error booking appointment:', error);
        throw error;
      }
    },
    [patientName, salesforceLeadId, posthog]
  );

  return { onBooking };
};