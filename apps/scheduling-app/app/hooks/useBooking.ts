import { useCallback } from 'react';
import type {
  BookAppointmentResponseType,
  SlotWithConfirmedLocation
} from '../../../../packages/scheduler/dist/index.d.ts';

interface UseBookingConfig {
  baseUrl: string;
  patientName: string;
  salesforceLeadId?: string;
}

export const useBooking = ({ baseUrl, patientName, salesforceLeadId }: UseBookingConfig) => {
  const onBooking = useCallback(
    async (slot: SlotWithConfirmedLocation): Promise<BookAppointmentResponseType> => {
      try {
        const response = await fetch('/api/sol/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-sol-api-url': baseUrl,
          },
          body: JSON.stringify({
            input: {
              eventId: slot.eventId,
              providerId: slot.providerId,
              userInfo: {
                userName: patientName,
                ...(salesforceLeadId ? { salesforceLeadId } : {}),
              },
              locationType: slot.confirmedLocation,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to book appointment: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
      }
    },
    [baseUrl, patientName, salesforceLeadId]
  );

  return { onBooking };
};