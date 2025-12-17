import { getWorkflowMetadata } from 'workflow';
import { bookAppointmentStep } from './steps/bookAppointment';
import { fetchEventDetailsStep, type EventDetails } from './steps/fetchEventDetails';
import { startIntakeCareflowStep } from './steps/startIntakeCareflow';
import { startHostedActivitySessionStep } from './steps/startHostedActivitySession';
import { writeProgressStep, closeProgressStreamStep } from './steps/writeProgress';
import { updateLeadStep } from './steps/updateLead';
import { haltReengagementCareflowsStep } from './steps/haltReengagementCareflows';

/**
 * Input for the booking workflow
 */
export interface BookingWorkflowInput {
  eventId: string;
  providerId: string;
  userName: string;
  salesforceLeadId: string;
  locationType: string;
  /** Patient's browser timezone */
  patientTimezone?: string;
  /** Clinical focus / service */
  clinicalFocus?: string;
}

/**
 * Result of the booking workflow.
 * Contains all data needed for the confirmation page.
 */
export interface BookingWorkflowResult {
  /** Workflow run ID - serves as the confirmation ID */
  confirmationId: string;
  /** Full event details for display on confirmation page */
  eventDetails: EventDetails;
  /** Awell careflow ID */
  careflowId: string;
  /** Awell patient ID */
  patientId: string;
  /** Session URL for intake forms */
  sessionUrl: string;
}

/**
 * Booking workflow with progress streaming.
 * 
 * Flow:
 * 1. Write "booking_started" to stream
 * 2. Book appointment via SOL API
 * 3. Write "appointment_booked" to stream
 * 4. Fetch event/provider details for confirmation page
 * 5. Start intake careflow (get careflowId, patientId)
 * 6. Halt any active re-engagement care flows
 * 7. Write "careflow_started" to stream
 * 8. Start hosted activity session (get sessionUrl)
 * 9. Write "session_ready" to stream
 * 10. Update Salesforce lead with booking details
 * 11. Close stream
 * 
 * The result contains all data needed for the confirmation page,
 * which only needs the confirmationId (runId) to fetch this data.
 */
export async function bookingWorkflow(
  input: BookingWorkflowInput
): Promise<BookingWorkflowResult> {
  "use workflow";

  const confirmationId = getWorkflowMetadata().workflowRunId;

  console.log('[bookingWorkflow] Starting:', {
    confirmationId,
    eventId: input.eventId,
    providerId: input.providerId,
    salesforceLeadId: input.salesforceLeadId,
    locationType: input.locationType,
  });

  // Step 1: Signal workflow started
  await writeProgressStep({
    type: 'booking_started',
    message: 'Confirming the date/time of your appointment...',
  });

  // Step 2: Book the appointment
  const bookingResult = await bookAppointmentStep({
    eventId: input.eventId,
    providerId: input.providerId,
    userName: input.userName,
    salesforceLeadId: input.salesforceLeadId,
    locationType: input.locationType,
  });

  // Step 3: Signal appointment booked
  await writeProgressStep({
    type: 'appointment_booked',
    message: 'Coordinating with your provider...',
    data: { eventId: bookingResult.eventId },
  });

  // Step 4: Fetch event/provider details for confirmation page
  const eventDetails = await fetchEventDetailsStep({
    eventId: input.eventId,
    providerId: input.providerId,
  });

  // Step 5: Start intake careflow (with confirmationId for return link)
  const { careflowId, patientId } = await startIntakeCareflowStep({
    salesforceLeadId: input.salesforceLeadId,
    eventId: input.eventId,
    providerId: input.providerId,
    confirmationId,
  });

  // Format localized time with timezone for Salesforce
  const localizedTimeWithTimezone = input.patientTimezone && eventDetails.startsAt
    ? `${new Date(eventDetails.startsAt).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        timeZone: input.patientTimezone,
      })} ${input.patientTimezone}`
    : undefined;

  // Steps 6-9: Start hosted activity session, halt re-engagement careflows, and update Salesforce lead
  const [{ sessionUrl }, ..._] = await Promise.all([
    startHostedActivitySessionStep({
      careflowId,
      patientId,
    }),
    haltReengagementCareflowsStep({
      patientId,
      confirmationId,
    }),
    updateLeadStep({
      leadId: input.salesforceLeadId,
      clinicalFocus: input.clinicalFocus,
      eventType: input.locationType,
      providerFirstName: eventDetails.providerFirstName,
      providerLastName: eventDetails.providerLastName,
      slotStartUtc: eventDetails.startsAt,
      localizedTimeWithTimezone,
      facility: eventDetails.facility,
    }),
    await writeProgressStep({
      type: 'careflow_started',
      message: 'Ensuring your intake forms are ready...',
      data: { careflowId, patientId },
    }),
  ]);

  // Step 10: Signal session ready (workflow complete from user perspective)
  await writeProgressStep({
    type: 'session_ready',
    message: 'Done! Redirecting...',
    data: { sessionUrl, confirmationId },
  });

  // Step 11: Close the stream
  await closeProgressStreamStep();

  console.log('[bookingWorkflow] Completed:', {
    confirmationId,
    eventId: eventDetails.eventId,
    careflowId,
    patientId,
  });

  return {
    confirmationId,
    eventDetails,
    careflowId,
    patientId,
    sessionUrl,
  };
}
