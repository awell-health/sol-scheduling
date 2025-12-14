'use server';

import { isEmpty, isNil, omit } from 'lodash';
import {
  API_METHODS,
  API_ROUTES,
  getAccessToken,
  getSolEnvSettings
} from '../../lib/sol-utils';
import {
  AvailabilityResponse,
  BookAppointmentInputSchema,
  BookAppointmentResponse,
  BookAppointmentResponseSchema,
  GetAvailabilitiesResponseSchema,
  GetProviderResponseSchema,
  GetProvidersInputSchema,
  GetProvidersResponseSchema,
  ProviderResponse,
  ProvidersResponse,
  ProviderSearchFilters
} from './_lib/types';
import { start } from 'workflow/api';
import { postBookingWorkflow } from '../../lib/workflow';

/** Timing metadata returned from API actions */
export type ApiTiming = {
  /** Time spent calling SOL API (ms) */
  solApiMs: number;
};

type SolFetchResult<T> = {
  data: T;
  timing: ApiTiming;
};

async function solFetch<T>({
  method,
  body,
  urlQuery
}: {
  method: API_METHODS;
  body?: Record<string, unknown>;
  urlQuery?: URLSearchParams;
}): Promise<SolFetchResult<T>> {
  const settings = getSolEnvSettings();
  const accessToken = await getAccessToken(omit(settings, 'baseUrl'));
  const url = new URL(`${settings.baseUrl}${API_ROUTES[method]}`);

  if (urlQuery) {
    url.search = urlQuery.toString();
  }

  const init: RequestInit = {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  const startTime = performance.now();
  console.log('[solFetch] Fetching URL:', url.toString(), 'with body', init.body);
  const response = await fetch(url, init);
  const solApiMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const text = await response.text();
    console.error('[SOL API Error]', {
      method,
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      body: body ? JSON.stringify(body) : undefined,
      query: urlQuery?.toString(),
      response: text,
    });
    throw new Error(
      `SOL request failed (${response.status} ${response.statusText}): ${text}`
    );
  }

  const data = (await response.json()) as T;
  return { data, timing: { solApiMs } };
}

function sanitizeFilters(filters: ProviderSearchFilters) {
  const sanitizedEntries = Object.entries(filters ?? {}).flatMap(
    ([key, value]) => {
      if (value === undefined || value === null) {
        return [];
      }

      if (typeof value === 'string' && value.trim().length === 0) {
        return [];
      }

      if (Array.isArray(value) && value.length === 0) {
        return [];
      }

      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        isEmpty(value)
      ) {
        return [];
      }

      return [[key, value]];
    }
  );

  return Object.fromEntries(sanitizedEntries);
}

export async function getProvidersAction(filters: ProviderSearchFilters) {
  try {
    const sanitized = sanitizeFilters(filters);
    const validatedInput = GetProvidersInputSchema.parse(sanitized);
    const { data, timing } = await solFetch<ProvidersResponse>({
      method: API_METHODS.GET_PROVIDERS,
      body: validatedInput
    });

    const parsed = GetProvidersResponseSchema.parse(data);
    return {
      ...parsed,
      _timing: timing,
      _meta: {
        filters: sanitized,
        providerCount: parsed.data?.length ?? 0,
      },
    };
  } catch (error) {
    console.error('[getProvidersAction] Error with params:', { filters });
    throw error;
  }
}

export async function getProviderAction(providerId: string) {
  try {
    if (isNil(providerId) || providerId.length === 0) {
      throw new Error('Provider ID is required');
    }

    const { data, timing } = await solFetch<ProviderResponse>({
      method: API_METHODS.GET_PROVIDER,
      urlQuery: new URLSearchParams({ providerId })
    });

    const parsed = GetProviderResponseSchema.parse(data);
    return { ...parsed, _timing: timing };
  } catch (error) {
    console.error('[getProviderAction] Error with params:', { providerId });
    throw error;
  }
}

export async function getAvailabilityAction(providerId: string) {
  try {
    if (isNil(providerId) || providerId.length === 0) {
      throw new Error('Provider ID is required');
    }

    const { data, timing } = await solFetch<AvailabilityResponse>({
      method: API_METHODS.GET_AVAILABILITY,
      body: { providerId: [providerId] }
    });

    const parsed = GetAvailabilitiesResponseSchema.parse(data);
    return { ...parsed, _timing: timing };
  } catch (error) {
    console.error('[getAvailabilityAction] Error with params:', { providerId });
    throw error;
  }
}

export async function bookAppointmentAction(payload: {
  eventId: string;
  providerId: string;
  userInfo: { userName: string; salesforceLeadId?: string };
  locationType: string;
  /** Patient's browser timezone (e.g., "America/Denver") */
  patientTimezone?: string;
  /** Clinical focus / service selected during onboarding */
  clinicalFocus?: string;
}) {
  try {
    // Only pass fields that SOL API expects
    const bookingPayload = {
      eventId: payload.eventId,
      providerId: payload.providerId,
      userInfo: payload.userInfo,
      locationType: payload.locationType,
    };
    
    const validatedInput = BookAppointmentInputSchema.parse(bookingPayload);
    
    // Mock booking response when env var is set (useful when SOL booking API is failing)
    const shouldMockBooking = process.env.MOCK_BOOKING_RESPONSE === 'true';
    
    let data: BookAppointmentResponse;
    let timing: { solApiMs: number };
    
    if (shouldMockBooking) {
      console.log('[bookAppointmentAction] MOCK_BOOKING_RESPONSE enabled - returning mock response', {
        eventId: payload.eventId,
        providerId: payload.providerId,
      });
      data = { data: { mocked: true, eventId: payload.eventId } };
      timing = { solApiMs: 0 };
    } else {
      const result = await solFetch<BookAppointmentResponse>({
        method: API_METHODS.BOOK_EVENT,
        body: validatedInput
      });
      data = result.data;
      timing = result.timing;
    }

    const parsed = BookAppointmentResponseSchema.parse(data);

    // Trigger post-booking workflow (fire-and-forget)
    // Uses start() to enqueue the workflow - it executes asynchronously
    // @see https://useworkflow.dev/docs/foundations/starting-workflows
    await start(postBookingWorkflow, [{
      eventId: payload.eventId,
      providerId: payload.providerId,
      salesforceLeadId: payload.userInfo.salesforceLeadId,
      clinicalFocus: payload.clinicalFocus,
      patientTimezone: payload.patientTimezone,
    }]);

    return { ...parsed, _timing: timing };
  } catch (error) {
    console.error('[bookAppointmentAction] Error with params:', { 
      eventId: payload.eventId,
      providerId: payload.providerId,
      locationType: payload.locationType,
      patientTimezone: payload.patientTimezone,
      clinicalFocus: payload.clinicalFocus,
      // Don't log full userInfo for privacy
      hasUserName: !!payload.userInfo?.userName,
      hasSalesforceLeadId: !!payload.userInfo?.salesforceLeadId,
    });
    throw error;
  }
}


