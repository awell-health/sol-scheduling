import { getWorkflowMetadata } from 'workflow';
import { getSalesforceClient } from '../../salesforce';
import { mapServiceToSalesforce } from '../../../app/providers/_lib/salesforce/transformers';

/**
 * Input for updateLead step
 */
export interface UpdateLeadInput {
  leadId: string;
  /** Patient's first name */
  firstName?: string;
  /** Patient's last name */
  lastName?: string;
  /** Clinical focus / visit reason (e.g., 'ADHD', 'Anxiety') */
  clinicalFocus?: string;
  /** Service type / therapeutic modality (e.g., 'Psychiatric', 'Therapy', 'Both', 'Not Sure') */
  service?: string;
  /** Event type (e.g., 'In-Person', 'Telehealth') */
  eventType?: string;
  /** Provider first name */
  providerFirstName?: string;
  /** Provider last name */
  providerLastName?: string;
  /** Appointment start time (ISO string) */
  slotStartUtc?: string;
  /** Localized slot time with timezone (e.g., "10:00 AM America/Denver") */
  localizedTimeWithTimezone?: string;
  /** Facility name */
  facility?: string;
}

/**
 * Result of updateLead step
 */
export interface UpdateLeadResult {
  success: boolean;
  error?: string;
}

/**
 * Update Salesforce lead after appointment is booked.
 * Marked as a workflow step for durability.
 */
export async function updateLeadStep(
  input: UpdateLeadInput
): Promise<UpdateLeadResult> {
  "use step";
  const metadata = getWorkflowMetadata();

  try {
    const client = getSalesforceClient();

    const updateData: Record<string, unknown> = {
      RecordTypeId: '0125w000000BRDxAAO',
    };

    // FirstName = Patient's first name
    if (input.firstName) {
      updateData.FirstName = input.firstName;
    }

    // LastName = Patient's last name
    if (input.lastName) {
      updateData.LastName = input.lastName;
    }

    // Visit_Reason__c = Clinical focus (e.g., 'ADHD', 'Anxiety')
    if (input.clinicalFocus) {
      updateData.Visit_Reason__c = input.clinicalFocus;
    }

    // Medication__c / Therapy__c = Service type mapping
    if (input.service) {
      const serviceMapping = mapServiceToSalesforce(input.service);
      updateData.Medication__c = serviceMapping.Medication__c;
      updateData.Therapy__c = serviceMapping.Therapy__c;
    }

    // Visit_Preference__c = Event type (e.g., 'In-Person', 'Telehealth')
    if (input.eventType) {
      updateData.Visit_Preference__c = input.eventType;
    }

    // Clinician_request_from_Online_Booking__c = "LastName, FirstName"
    if (input.providerLastName || input.providerFirstName) {
      const clinicianName = [input.providerLastName, input.providerFirstName]
        .filter(Boolean)
        .join(', ');
      if (clinicianName) {
        updateData.Clinician_request_from_Online_Booking__c = clinicianName;
      }
    }

    // Requested_Appt_Date__c = ISO datetime
    if (input.slotStartUtc) {
      updateData.Requested_Appt_Date__c = input.slotStartUtc;
    }

    // Requested_Appt_Time__c = "10:00 AM America/Denver"
    if (input.localizedTimeWithTimezone) {
      updateData.Requested_Appt_Time__c = input.localizedTimeWithTimezone;
    }

    // Facility__c = Facility name
    if (input.facility) {
      updateData.Facility__c = input.facility;
    }

    // Magic_Link__c = Confirmation page URL
    const runId = metadata.workflowRunId;
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://schedule.solmentalhealth.com';
    const confirmationUrl = `${baseUrl}/confirmation/${runId}`;
    updateData.Magic_Link__c = confirmationUrl;

    console.log('[updateLeadStep] Updating lead with booking data:', {
      leadId: input.leadId,
      updateData,
      metadata,
    });

    await client.updateLead(input.leadId, updateData);

    return { success: true };
  } catch (error) {
    console.error('[updateLeadStep] Failed to update Salesforce lead:', {
      error,
      params: {
        leadId: input.leadId,
        clinicalFocus: input.clinicalFocus,
        service: input.service,
        eventType: input.eventType,
        providerLastName: input.providerLastName,
        facility: input.facility,
      },
      metadata,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

