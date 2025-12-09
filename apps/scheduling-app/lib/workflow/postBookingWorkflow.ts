import { getEventDetailsStep, type EventDetails } from './steps/getEventDetails';
import { updateLeadStep, type UpdateLeadResult } from './steps/updateLead';

/**
 * Input data for the post-booking workflow
 */
export interface PostBookingWorkflowInput {
  eventId: string;
  providerId: string;
  salesforceLeadId?: string;
  /** Clinical focus / visit reason selected during onboarding */
  clinicalFocus?: string;
  /** Patient's timezone for localized time formatting */
  patientTimezone?: string;
}

/**
 * Result of the post-booking workflow
 */
export interface PostBookingWorkflowResult {
  success: boolean;
  eventDetails: EventDetails;
  leadUpdate?: UpdateLeadResult;
}

/**
 * Post-booking workflow that runs after an appointment is booked.
 * 
 * Steps:
 * 1. Fetch event details from SOL API
 * 2. Update Salesforce lead with booking details
 * 
 * @see https://useworkflow.dev/
 */
export async function postBookingWorkflow(
  input: PostBookingWorkflowInput
): Promise<PostBookingWorkflowResult> {
  "use workflow";

  const timezone = input.patientTimezone ?? 'America/Denver';

  // Step 1: Fetch event details from SOL
  const eventDetails = await getEventDetailsStep({
    eventId: input.eventId,
    providerId: input.providerId,
    timeZone: timezone,
  });

  console.log('[postBookingWorkflow] Event details fetched:', {
    eventId: input.eventId,
    salesforceLeadId: input.salesforceLeadId,
    summary: eventDetails.summary,
    providerName: eventDetails.providerName,
    providerFirstName: eventDetails.providerFirstName,
    providerLastName: eventDetails.providerLastName,
    slotStartUtc: eventDetails.slotStartUtc,
    localizedDate: eventDetails.localizedDate,
    localizedTime: eventDetails.localizedTime,
    eventType: eventDetails.eventType,
    facility: eventDetails.eventFacility,
    clinicalFocus: input.clinicalFocus,
  });

  // Step 2: Update Salesforce lead with booking details (if leadId provided)
  let leadUpdate: UpdateLeadResult | undefined;
  
  if (input.salesforceLeadId) {
    // Build localized time with timezone (e.g., "10:00 AM America/Denver")
    const localizedTimeWithTimezone = `${eventDetails.localizedTime} ${timezone}`;

    leadUpdate = await updateLeadStep({
      leadId: input.salesforceLeadId,
      clinicalFocus: input.clinicalFocus,
      eventType: eventDetails.eventType,
      providerFirstName: eventDetails.providerFirstName,
      providerLastName: eventDetails.providerLastName,
      slotStartUtc: new Date(eventDetails.slotStartUtc).toISOString(),
      localizedTimeWithTimezone,
      facility: eventDetails.eventFacility,
    });

    console.log('[postBookingWorkflow] Lead update result:', {
      salesforceLeadId: input.salesforceLeadId,
      success: leadUpdate.success,
      error: leadUpdate.error,
    });
  } else {
    console.log('[postBookingWorkflow] No salesforceLeadId provided, skipping lead update');
  }

  // Return the workflow result
  return {
    success: true,
    eventDetails,
    leadUpdate,
  };
}

export type { EventDetails };
