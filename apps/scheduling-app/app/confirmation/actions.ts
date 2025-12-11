'use server';

import { redirect } from 'next/navigation';

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

/**
 * Start the intake form flow via Awell API.
 * Returns a redirect to the intake form URL.
 * 
 * TODO: Wire up to Awell API
 */
export async function startIntakeFormAction(input: StartIntakeFormInput): Promise<never> {
  const { eventId, eventDetails, salesforceLeadId } = input;
  
  // TODO: Call Awell API to create intake session
  // const session = await awellClient.createIntakeSession({
  //   eventId,
  //   eventDetails,
  //   salesforceLeadId,
  // });
  
  console.log('Starting intake form', { eventId, eventDetails, salesforceLeadId });
  
  // TODO: Replace with actual Awell URL from API response
  const intakeFormUrl = `https://intake.example.com/form?eventId=${eventId}`;
  
  redirect(intakeFormUrl);
}
