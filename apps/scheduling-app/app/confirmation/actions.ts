'use server';

import { redirect } from 'next/navigation';
import { AwellSdk, type Environment } from '@awell-health/awell-sdk';

const INTAKE_CAREFLOW_DEFINITION_ID = 'mDA3qND1oHob';

export type EventDetails = {
  eventId?: string;
  providerId?: string;
  providerName?: string;
  startsAt?: string;
  duration?: string;
  locationType?: string;
  facility?: string;
  state?: string;
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

/**
 * Start the intake form flow via Awell API.
 * Starts a care flow and creates a hosted pages session, then redirects to the hosted pages URL.
 */
export async function startIntakeFormAction(input: StartIntakeFormInput): Promise<never> {
  const { eventId, eventDetails, salesforceLeadId } = input;
  
  console.log('Starting intake form', { eventId, eventDetails, salesforceLeadId });
  
  const awell = getAwellClient();
  
  const response = await awell.orchestration.mutation({
    startHostedPathwaySession: {
      __args: {
        input: {
          pathway_definition_id: INTAKE_CAREFLOW_DEFINITION_ID,
          ...(salesforceLeadId && { patient_identifier: {
            system: 'https://test-salesforce-url.com',
            value: salesforceLeadId,
          } }),
        },
      },
      session_url: true,
    },
  });

  const sessionUrl = response.startHostedPathwaySession?.session_url;

  if (!sessionUrl) {
    throw new Error('Failed to create Awell hosted pages session');
  }

  redirect(sessionUrl);
}
