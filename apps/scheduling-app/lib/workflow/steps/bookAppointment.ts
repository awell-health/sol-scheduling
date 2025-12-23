import { omit } from 'lodash';
import {
  API_METHODS,
  API_ROUTES,
  getAccessToken,
  getSolEnvSettings,
} from '../../sol-utils';

/**
 * Input for bookAppointment step
 */
export interface BookAppointmentStepInput {
  eventId: string;
  providerId: string;
  userName: string;
  salesforceLeadId?: string;
  locationType: string;
}

/**
 * Result of bookAppointment step
 */
export interface BookAppointmentStepResult {
  success: boolean;
  eventId: string;
  /** Raw response data from SOL API */
  data: Record<string, unknown>;
}

/**
 * Book an appointment via the SOL API.
 * Marked as a workflow step for durability.
 */
export async function bookAppointmentStep(
  input: BookAppointmentStepInput
): Promise<BookAppointmentStepResult> {
  "use step";

  console.log('[bookAppointmentStep] Booking appointment:', {
    eventId: input.eventId,
    providerId: input.providerId,
    locationType: input.locationType,
    hasSalesforceLeadId: !!input.salesforceLeadId,
  });

  // Mock booking response when env var is set
  const shouldMockBooking = process.env.MOCK_BOOKING_RESPONSE === 'true';

  if (shouldMockBooking) {
    console.log('[bookAppointmentStep] MOCK_BOOKING_RESPONSE enabled');
    return {
      success: true,
      eventId: input.eventId,
      data: { mocked: true, eventId: input.eventId },
    };
  }

  const settings = getSolEnvSettings();
  const accessToken = await getAccessToken(omit(settings, 'baseUrl'));
  const url = new URL(`${settings.baseUrl}${API_ROUTES[API_METHODS.BOOK_EVENT]}`);

  const body = {
    eventId: input.eventId,
    providerId: input.providerId,
    userInfo: {
      userName: input.userName,
      salesforceLeadId: input.salesforceLeadId,
    },
    locationType: input.locationType,
  };

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('[bookAppointmentStep] SOL API Error:', {
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      response: text,
    });
    throw new Error(`Failed to book appointment: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  console.log('[bookAppointmentStep] Appointment booked:', {
    eventId: input.eventId,
    providerId: input.providerId,
  });

  return {
    success: true,
    eventId: input.eventId,
    data: json.data ?? json,
  };
}

