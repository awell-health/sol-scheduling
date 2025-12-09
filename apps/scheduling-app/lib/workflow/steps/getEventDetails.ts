import { IncomingHttpHeaders } from 'http';
import { omit } from 'lodash';
import {
  API_METHODS,
  API_ROUTES,
  getAccessToken,
  getSolEnvSettings
} from '../../sol-utils';

const DEFAULT_SOL_BASE_URL =
  process.env.NEXT_PUBLIC_SOL_API_URL ||
  process.env.SOL_FALLBACK_API_URL ||
  '';

/**
 * Input for getEventDetails step
 */
export interface GetEventDetailsInput {
  eventId: string;
  providerId: string;
  timeZone: string;
}

/**
 * Event details returned from SOL API
 */
export interface EventDetails {
  summary: string;
  slotStartUtc: string;
  slotStartTime: string;
  localizedDate: string;
  localizedTime: string;
  providerName: string;
  providerFirstName: string;
  providerLastName: string;
  duration: string;
  booked: boolean;
  eventType: string;
  eventFacility: string;
  userPreferredLocation: string;
}

/**
 * Get localized date/time string from ISO date
 */
function getLocalDateTimeString(
  isoDate: string,
  timeZone: string,
  locale: string
): { date: string; time: string } {
  const dateObj = new Date(isoDate);
  
  const date = dateObj.toLocaleDateString(locale, {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const time = dateObj.toLocaleTimeString(locale, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  return { date, time };
}

/**
 * Fetch event details from SOL API.
 * Marked as a workflow step for durability.
 */
export async function getEventDetailsStep(
  input: GetEventDetailsInput
): Promise<EventDetails> {
  "use step";

  // Get settings - for workflow context we need to handle headers differently
  const baseUrl = DEFAULT_SOL_BASE_URL;
  
  if (!baseUrl) {
    throw new Error('Unable to resolve SOL base URL (missing NEXT_PUBLIC_SOL_API_URL)');
  }

  const incomingHeaders: IncomingHttpHeaders = {
    'x-sol-api-url': baseUrl
  };

  const settings = getSolEnvSettings({ headers: incomingHeaders });
  const accessToken = await getAccessToken(omit(settings, 'baseUrl'));
  
  // Build URL with query params
  const url = new URL(`${settings.baseUrl}${API_ROUTES[API_METHODS.GET_EVENT]}`);
  url.searchParams.set('eventId', input.eventId);
  url.searchParams.set('providerId', input.providerId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('[getEventDetailsStep] SOL API Error:', {
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      response: text,
    });
    throw new Error(`Failed to get event details: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const data = json.data;

  // Safe to assume SOL is US only
  const locale = 'en-US';
  const { date: localizedDate, time: localizedTime } = getLocalDateTimeString(
    data.slotstart,
    input.timeZone,
    locale
  );

  return {
    summary: data.summary,
    slotStartUtc: data.slotstart,
    slotStartTime: new Date(data.slotstart).toTimeString().split(' ')[0],
    localizedDate,
    localizedTime,
    providerName: data.provider?.name ?? '',
    providerFirstName: data.provider?.firstName ?? '',
    providerLastName: data.provider?.lastName ?? '',
    duration: String(data.duration),
    booked: Boolean(data.booked),
    eventType: data.eventType ?? '',
    eventFacility: data.facility ?? '',
    userPreferredLocation: data.location ?? '',
  };
}
