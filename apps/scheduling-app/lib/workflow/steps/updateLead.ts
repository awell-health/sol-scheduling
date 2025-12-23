import { getSalesforceClient } from '../../salesforce';

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

  try {
    const client = getSalesforceClient();

    const updateData: Record<string, unknown> = {
      RecordTypeId: '0125w000000BRDxAAO',
      Status: 'Appt Selected',
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

    console.log('[updateLeadStep] Updating lead with booking data:', {
      leadId: input.leadId,
      updateData,
    });

    await client.updateLead(input.leadId, updateData);

    return { success: true };
  } catch (error) {
    console.error('[updateLeadStep] Failed to update Salesforce lead:', {
      error,
      params: {
        leadId: input.leadId,
        clinicalFocus: input.clinicalFocus,
        eventType: input.eventType,
        providerLastName: input.providerLastName,
        facility: input.facility,
      },
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

