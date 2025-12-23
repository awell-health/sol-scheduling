import { omit } from 'lodash';
import {
  API_METHODS,
  API_ROUTES,
  getAccessToken,
  getSolEnvSettings,
} from '../../sol-utils';

/**
 * Event details that will be stored in the workflow result
 */
export interface EventDetails {
  eventId: string;
  providerId: string;
  providerName: string;
  providerFirstName?: string;
  providerLastName?: string;
  providerImage?: string;
  startsAt: string;
  duration: string;
  locationType: string;
  facility?: string;
}

/**
 * Input for fetchEventDetails step
 */
export interface FetchEventDetailsInput {
  eventId: string;
  providerId: string;
}

/**
 * Fetch provider details from SOL API.
 */
async function getProviderDetails(providerId: string, accessToken: string, baseUrl: string) {
  const url = new URL(`${baseUrl}${API_ROUTES[API_METHODS.GET_PROVIDER]}`);
  url.searchParams.set('providerId', providerId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.warn('[fetchEventDetailsStep] Failed to fetch provider:', {
      providerId,
      status: response.status,
    });
    return null;
  }

  const json = await response.json();
  return json.data;
}

/**
 * Fetch event and provider details from SOL API.
 * This step is idempotent and durable.
 */
export async function fetchEventDetailsStep(
  input: FetchEventDetailsInput
): Promise<EventDetails> {
  "use step";

  console.log('[fetchEventDetailsStep] Fetching event details:', input);

  const settings = getSolEnvSettings();
  const accessToken = await getAccessToken(omit(settings, 'baseUrl'));

  // Fetch event and provider details in parallel
  const [eventResponse, providerData] = await Promise.all([
    (async () => {
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
        console.error('[fetchEventDetailsStep] SOL API Error:', {
          url: url.toString(),
          status: response.status,
          statusText: response.statusText,
          response: text,
        });
        throw new Error(`Failed to get event details: ${response.status} ${response.statusText}`);
      }

      return response.json();
    })(),
    getProviderDetails(input.providerId, accessToken, settings.baseUrl),
  ]);

  const eventData = eventResponse.data;

  // Use provider data for name/image, fallback to event data
  const providerFirstName = providerData?.firstName ?? eventData.provider?.firstName ?? undefined;
  const providerLastName = providerData?.lastName ?? eventData.provider?.lastName ?? undefined;
  
  const providerName = providerFirstName && providerLastName
    ? `${providerFirstName} ${providerLastName}`
    : eventData.provider?.name
      ?? [providerFirstName, providerLastName].filter(Boolean).join(' ')
      ?? 'Provider';

  const providerImage = providerData?.image ?? eventData.provider?.image ?? undefined;

  const result: EventDetails = {
    eventId: eventData.eventId ?? input.eventId,
    providerId: eventData.providerId ?? eventData.provider?.id ?? input.providerId,
    providerName,
    providerFirstName,
    providerLastName,
    providerImage,
    startsAt: eventData.slotstart,
    duration: String(eventData.duration ?? 60),
    locationType: eventData.location ?? eventData.eventType ?? 'Telehealth',
    facility: eventData.facility ?? undefined,
  };

  console.log('[fetchEventDetailsStep] Event details fetched:', result);

  return result;
}

