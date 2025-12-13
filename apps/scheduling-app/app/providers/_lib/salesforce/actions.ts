'use server';

import { getSalesforceClient } from '../../../../lib/salesforce';
import PostHogClient from '../../../../posthog';

/**
 * Lead data returned from Salesforce when fetching by ID.
 * Fields mapped to onboarding preferences.
 */
export interface SalesforceLeadData {
  id: string;
  phone: string | null;
  state: string | null;
  insurance: string | null;
  service: string | null;
  consent: boolean | null;
}

/**
 * Fetch a Salesforce lead by ID and return mapped fields.
 * Used when `slc` param is present in URL.
 */
export async function getLeadAction(
  leadId: string
): Promise<{ success: boolean; lead?: SalesforceLeadData; error?: string }> {
  try {
    if (!leadId || leadId.trim().length === 0) {
      return { success: false, error: 'Lead ID is required' };
    }

    const client = getSalesforceClient();
    console.log('[getLeadAction] Fetching lead:', leadId);

    const rawLead = await client.getLead(leadId);
    console.log('[getLeadAction] Raw lead data:', rawLead);

    // Map Salesforce fields to our schema
    const lead: SalesforceLeadData = {
      id: leadId,
      phone: typeof rawLead.Phone === 'string' ? rawLead.Phone : null,
      state: typeof rawLead.Market__c === 'string' ? rawLead.Market__c : null,
      insurance: typeof rawLead.Insurance_Company_Name__c === 'string' ? rawLead.Insurance_Company_Name__c : null,
      // Service_Type__c - not yet created in Salesforce, but ready for it
      service: typeof rawLead.Service_Type__c === 'string' ? rawLead.Service_Type__c : null,
      consent: typeof rawLead.Contact_Consent__c === 'boolean' ? rawLead.Contact_Consent__c : null,
    };

    console.log('[getLeadAction] Lead data:', {
      id: lead.id,
      hasPhone: !!lead.phone,
      state: lead.state,
      insurance: lead.insurance,
      service: lead.service,
      consent: lead.consent,
    });

    return { success: true, lead };
  } catch (error) {
    console.error('[getLeadAction] Failed to fetch Salesforce lead:', {
      error,
      leadId,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export interface CreateLeadInput {
  phone: string;
  state?: string | null;
  service?: string | null;
  insurance?: string | null;
  posthogDistinctId?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export interface UpdateLeadInput {
  leadId: string;
  /** Insurance carrier name */
  insurance?: string;
}

/**
 * Input for updating lead after appointment is booked.
 * Uses field names matching the production Salesforce schema.
 */
export interface UpdateLeadBookingInput {
  leadId: string;
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
 * Create a new Salesforce lead when phone number is captured.
 * Uses the same field mapping as the Website - Online Booking source.
 */
export async function createLeadAction(
  input: CreateLeadInput
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const client = getSalesforceClient();
    console.log('[createLeadAction] Creating lead with data:', {
      phone: input.phone,
      state: input.state,
      service: input.service,
      insurance: input.insurance,
      posthogDistinctId: input.posthogDistinctId,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
    });

    const leadData = {
      // Required fields matching other booking systems
      RecordTypeId: '0125w000000BRDxAAO',
      FirstName: 'No',
      LastName: 'Name Yet',
      LeadSource: 'Website - Online Booking',
      Status: 'New',
      Inquiry_Date__c: new Date().toISOString(),
      Phone: input.phone,
      // Optional fields
      ...(input.state && { Market__c: input.state }),
      ...(input.insurance && { Insurance_Company_Name__c: input.insurance }),
      // UTM tracking
      ...(input.utmSource && { UTM_Source__c: input.utmSource }),
      ...(input.utmMedium && { UTM_Medium__c: input.utmMedium }),
      ...(input.utmCampaign && { UTM_Campaign__c: input.utmCampaign }),
    };

    const result = await client.createLead(leadData);

    if (!result.success) {
      throw new Error(`[createLeadAction] Failed to create lead: ${JSON.stringify(result.errors)}`);
    }

    // Link to PostHog if we have a distinct ID
    if (input.posthogDistinctId) {
      const posthog = PostHogClient();
      posthog.identify({
        distinctId: input.posthogDistinctId,
        properties: {
          salesforce_lead_id: result.id,
        },
      });
      posthog.capture({
        distinctId: input.posthogDistinctId,
        event: 'lead_created',
        properties: {
          salesforce_lead_id: result.id,
        },
      });
      await posthog.flush();
    }

    return { success: true, leadId: result.id };
  } catch (error) {
    console.error('[createLeadAction] Failed to create Salesforce lead:', {
      error,
      // Log params but mask phone for privacy
      params: {
        phone: input.phone ? `***${input.phone.slice(-4)}` : undefined,
        state: input.state,
        service: input.service,
        hasPosthogId: !!input.posthogDistinctId,
      },
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing Salesforce lead with insurance info
 */
export async function updateLeadAction(
  input: UpdateLeadInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getSalesforceClient();

    const updateData: Record<string, unknown> = {};

    if (input.insurance) {
      updateData.Insurance_Company_Name__c = input.insurance;
    }

    if (Object.keys(updateData).length > 0) {
      await client.updateLead(input.leadId, updateData);
    }

    return { success: true };
  } catch (error) {
    console.error('[updateLeadAction] Failed to update Salesforce lead:', {
      error,
      params: {
        leadId: input.leadId,
        hasInsurance: !!input.insurance,
      },
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update Salesforce lead after appointment is booked.
 * Uses the production Salesforce field schema.
 */
export async function updateLeadBookingAction(
  input: UpdateLeadBookingInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getSalesforceClient();

    const updateData: Record<string, unknown> = {
      RecordTypeId: '0125w000000BRDxAAO',
      Status: 'Appt Selected',
    };

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
      // Ensure it's a proper ISO string for Salesforce
      updateData.Requested_Appt_Date__c = new Date(input.slotStartUtc).toISOString();
    }

    // Requested_Appt_Time__c = "10:00 AM America/Denver"
    if (input.localizedTimeWithTimezone) {
      updateData.Requested_Appt_Time__c = input.localizedTimeWithTimezone;
    }

    // Facility__c = Facility name
    if (input.facility) {
      updateData.Facility__c = input.facility;
    }

    console.log('[updateLeadBookingAction] Updating lead with booking data:', {
      leadId: input.leadId,
      updateData,
    });

    await client.updateLead(input.leadId, updateData);

    return { success: true };
  } catch (error) {
    console.error('[updateLeadBookingAction] Failed to update Salesforce lead:', {
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

/**
 * Capture booking completion event in PostHog
 */
export async function captureBookingEventAction(input: {
  posthogDistinctId: string;
  leadId: string;
  providerId: string;
  appointmentTime: string;
  locationType: string;
}): Promise<void> {
  try {
    const posthog = PostHogClient();
    posthog.capture({
      distinctId: input.posthogDistinctId,
      event: 'appointment_booked',
      properties: {
        salesforce_lead_id: input.leadId,
        provider_id: input.providerId,
        appointment_time: input.appointmentTime,
        location_type: input.locationType,
      },
    });
    await posthog.flush();
  } catch (error) {
    console.error('[captureBookingEventAction] Failed to capture booking event:', {
      error,
      params: {
        leadId: input.leadId,
        providerId: input.providerId,
        locationType: input.locationType,
      },
    });
  }
}

