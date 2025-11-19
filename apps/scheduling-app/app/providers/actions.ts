'use server';

import { headers } from 'next/headers';
import { IncomingHttpHeaders } from 'http';
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

const DEFAULT_SOL_BASE_URL =
  process.env.NEXT_PUBLIC_SOL_API_URL ||
  process.env.SOL_FALLBACK_API_URL ||
  '';

if (!DEFAULT_SOL_BASE_URL) {
  console.warn(
    'Missing NEXT_PUBLIC_SOL_API_URL or SOL_FALLBACK_API_URL. SOL requests will fail without a base URL.'
  );
}

async function getSettings() {
  const requestHeaders = await headers();
  const overrideBaseUrl = requestHeaders.get('x-sol-api-url');
  const baseUrl = overrideBaseUrl ?? DEFAULT_SOL_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      'Unable to resolve SOL base URL (missing NEXT_PUBLIC_SOL_API_URL)'
    );
  }

  const incomingHeaders: IncomingHttpHeaders = {
    'x-sol-api-url': baseUrl
  };

  return getSolEnvSettings({ headers: incomingHeaders });
}

async function solFetch<T>({
  method,
  body,
  urlQuery
}: {
  method: API_METHODS;
  body?: Record<string, unknown>;
  urlQuery?: URLSearchParams;
}) {
  const settings = await getSettings();
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

  const response = await fetch(url, init);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `SOL request failed (${response.status} ${response.statusText}): ${text}`
    );
  }

  return (await response.json()) as T;
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
  const sanitized = sanitizeFilters(filters);
  const validatedInput = GetProvidersInputSchema.parse(sanitized);
  const json = await solFetch<ProvidersResponse>({
    method: API_METHODS.GET_PROVIDERS,
    body: validatedInput
  });

  return GetProvidersResponseSchema.parse(json);
}

export async function getProviderAction(providerId: string) {
  if (isNil(providerId) || providerId.length === 0) {
    throw new Error('Provider ID is required');
  }

  const json = await solFetch<ProviderResponse>({
    method: API_METHODS.GET_PROVIDER,
    urlQuery: new URLSearchParams({ providerId })
  });

  return GetProviderResponseSchema.parse(json);
}

export async function getAvailabilityAction(providerId: string) {
  if (isNil(providerId) || providerId.length === 0) {
    throw new Error('Provider ID is required');
  }

  const json = await solFetch<AvailabilityResponse>({
    method: API_METHODS.GET_AVAILABILITY,
    body: { providerId: [providerId] }
  });

  return GetAvailabilitiesResponseSchema.parse(json);
}

export async function bookAppointmentAction(payload: {
  eventId: string;
  providerId: string;
  userInfo: { userName: string; salesforceLeadId?: string };
  locationType: string;
}) {
  const validatedInput = BookAppointmentInputSchema.parse(payload);
  const json = await solFetch<BookAppointmentResponse>({
    method: API_METHODS.BOOK_EVENT,
    body: validatedInput
  });

  return BookAppointmentResponseSchema.parse(json);
}


