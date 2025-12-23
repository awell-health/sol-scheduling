'use server';

import { omit } from 'lodash';
import { redirect } from 'next/navigation';
import { AwellSdk, type Environment } from '@awell-health/awell-sdk';
import {
  API_METHODS,
  API_ROUTES,
  getAccessToken,
  getSolEnvSettings
} from '../../lib/sol-utils';
import type { BookingWorkflowResult } from '../../lib/workflow';

const INTAKE_CAREFLOW_DEFINITION_ID = 'mDA3qND1oHob';

export type EventDetails = {
  eventId: string;
  providerId: string;
  providerName: string;
  providerImage?: string;
  startsAt: string;
  duration: string;
  locationType: string;
  facility?: string;
};

export type StartIntakeFormInput = {
  eventId: string;
  eventDetails: EventDetails;
  salesforceLeadId?: string;
};

function getAwellClient() {
  const apiKey = process.env.AWELL_API_KEY;
  const environment = (process.env.AWELL_ENVIRONMENT || 'sandbox') as Environment;

  if (!apiKey) {
    throw new Error('AWELL_API_KEY environment variable is not set');
  }

  return new AwellSdk({
    apiKey,
    environment,
  });
}

function getSalesforceIdentifierSystem() {
  const salesforceIdentifierSystem = process.env.SALESFORCE_IDENTIFIER_SYSTEM;
  if (!salesforceIdentifierSystem) {
    throw new Error('SALESFORCE_IDENTIFIER_SYSTEM environment variable is not set');
  }
  return salesforceIdentifierSystem;
}

/**
 * Start the intake form flow via Awell API.
 * Starts a care flow and creates a hosted pages session, then redirects to the hosted pages URL.
 */
export async function startIntakeFormAction(input: StartIntakeFormInput): Promise<never> {
  const { eventId, eventDetails, salesforceLeadId } = input;
  
  console.log('[startIntakeFormAction] Starting intake form', { eventId, eventDetails, salesforceLeadId });
  
  const awell = getAwellClient();
  
  const response = await awell.orchestration.mutation({
    startHostedPathwaySession: {
      __args: {
        input: {
          pathway_definition_id: INTAKE_CAREFLOW_DEFINITION_ID,
          ...(salesforceLeadId && { patient_identifier: {
            system: getSalesforceIdentifierSystem(),
            value: salesforceLeadId,
          } }),
        },
      },
      session_url: true,
    },
  });
  console.log('[startIntakeFormAction] Awell response:', response);

  const sessionUrl = response.startHostedPathwaySession?.session_url;

  if (!sessionUrl) {
    throw new Error('Failed to create Awell hosted pages session');
  }

  redirect(sessionUrl);
}

/**
 * Fetch provider details from SOL API.
 * Used to get provider image URL.
 * @see https://awell-health.github.io/sol-scheduling/
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
    console.warn('[getProviderDetails] Failed to fetch provider:', {
      providerId,
      status: response.status,
    });
    return null;
  }

  const json = await response.json();
  return json.data;
}

/**
 * Fetch event details from SOL API.
 * Also fetches provider details to get the image URL.
 * Used by confirmation page to display appointment information.
 */
export async function getEventDetailsAction(eventId: string, providerId: string): Promise<EventDetails> {
  console.log('[getEventDetailsAction] Fetching event details:', { eventId, providerId });

  const settings = getSolEnvSettings();
  const accessToken = await getAccessToken(omit(settings, 'baseUrl'));

  // Fetch event and provider details in parallel
  const [eventResponse, providerData] = await Promise.all([
    (async () => {
      const url = new URL(`${settings.baseUrl}${API_ROUTES[API_METHODS.GET_EVENT]}`);
      url.searchParams.set('eventId', eventId);
      url.searchParams.set('providerId', providerId);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('[getEventDetailsAction] SOL API Error:', {
          url: url.toString(),
          status: response.status,
          statusText: response.statusText,
          response: text,
        });
        throw new Error(`Failed to get event details: ${response.status} ${response.statusText}`);
      }

      return response.json();
    })(),
    getProviderDetails(providerId, accessToken, settings.baseUrl),
  ]);

  const eventData = eventResponse.data;

  // Use provider data for name/image, fallback to event data
  const providerName = providerData?.firstName && providerData?.lastName
    ? `${providerData.firstName} ${providerData.lastName}`
    : eventData.provider?.name
      ?? [eventData.provider?.firstName, eventData.provider?.lastName].filter(Boolean).join(' ')
      ?? 'Provider';

  const providerImage = providerData?.image ?? eventData.provider?.image ?? undefined;

  return {
    eventId: eventData.eventId ?? eventId,
    providerId: eventData.providerId ?? eventData.provider?.id ?? providerId,
    providerName,
    providerImage,
    startsAt: eventData.slotstart,
    duration: String(eventData.duration ?? 60),
    locationType: eventData.location ?? eventData.eventType ?? 'Telehealth',
    facility: eventData.facility ?? undefined,
  };
}

export type WorkflowStatusResult = 
  | { status: 'completed'; result: BookingWorkflowResult }
  | { status: 'running' }
  | { status: 'error'; message: string };

/**
 * Get the status and result of a booking workflow.
 * If completed, returns the result including all data needed for confirmation page.
 * If still running, returns status 'running'.
 */
export async function getWorkflowStatusAction(
  confirmationId: string
): Promise<WorkflowStatusResult> {
  console.log('[getWorkflowStatusAction] Checking workflow status:', confirmationId);
  
  const { getRun } = await import('workflow/api');
  
  try {
    const run = getRun<BookingWorkflowResult>(confirmationId);
    const status = await run.status;
    
    console.log('[getWorkflowStatusAction] Workflow status:', status);
    
    if (status === 'completed') {
      const result = await run.returnValue;
      console.log('[getWorkflowStatusAction] Got result:', result);
      return { status: 'completed', result };
    }
    
    if (status === 'failed' || status === 'cancelled') {
      return { status: 'error', message: `Workflow ${status}` };
    }
    
    // Still running (pending, running, paused)
    return { status: 'running' };
  } catch (err) {
    console.error('[getWorkflowStatusAction] Error:', err);
    return { 
      status: 'error', 
      message: err instanceof Error ? err.message : 'Failed to get workflow status' 
    };
  }
}

/**
 * Get the full confirmation data from a completed workflow.
 * Used by the confirmation page to display appointment details.
 * 
 * @param confirmationId - The workflow run ID (confirmation ID)
 * @returns The full workflow result if completed, null otherwise
 */
export async function getConfirmationDataAction(
  confirmationId: string
): Promise<BookingWorkflowResult | null> {
  console.log('[getConfirmationDataAction] Getting confirmation data:', confirmationId);
  
  const result = await getWorkflowStatusAction(confirmationId);
  
  if (result.status === 'completed') {
    return result.result;
  }
  
  if (result.status === 'error') {
    console.error('[getConfirmationDataAction] Error:', result.message);
  }
  
  return null;
}
