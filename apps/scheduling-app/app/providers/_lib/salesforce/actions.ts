'use server';

import { getSalesforceClient } from '../../../../lib/salesforce';
import PostHogClient from '../../../../posthog';
import { mapServiceToSalesforce, mapSalesforceToService, mapConsentToSalesforce } from './transformers';
import { FieldId, getSalesforceReadField, getSalesforceWriteField } from '../../../../lib/fields';
import { start } from 'workflow/api';
import { reengagementCareflowWorkflow } from '../../../../lib/workflow';

/**
 * Lead data returned from Salesforce when fetching by ID.
 * Fields mapped to onboarding preferences.
 */
export interface SalesforceLeadData {
  id: string;
  phone: string | null;
  state: string | null;
  insurance: string | null;
  /** Derived from Medication__c/Therapy__c */
  service: string | null;
  consent: boolean | null;
  /** ISO 8601 UTC timestamp of when consent was first given */
  consentTimestamp: string | null;
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

    // Get Salesforce field names from registry
    const phoneField = getSalesforceReadField(FieldId.PHONE);
    const stateField = getSalesforceReadField(FieldId.STATE);
    const insuranceField = getSalesforceReadField(FieldId.INSURANCE);
    const consentField = getSalesforceReadField(FieldId.CONSENT);
    // SERVICE maps to two boolean fields - handled by transformer
    
    // Extract boolean fields for service type
    const medication = typeof rawLead.Medication__c === 'boolean' ? rawLead.Medication__c : null;
    const therapy = typeof rawLead.Therapy__c === 'boolean' ? rawLead.Therapy__c : null;

    // Map Salesforce fields to our schema using registry field names
    const lead: SalesforceLeadData = {
      id: leadId,
      phone: typeof rawLead[phoneField] === 'string' ? rawLead[phoneField] : null,
      state: typeof rawLead[stateField] === 'string' ? rawLead[stateField] : null,
      insurance: typeof rawLead[insuranceField] === 'string' ? rawLead[insuranceField] : null,
      // Derive service type from Medication__c and Therapy__c boolean fields (compound mapping)
      service: mapSalesforceToService(medication, therapy),
      consent: typeof rawLead[consentField] === 'boolean' ? rawLead[consentField] : null,
      consentTimestamp: typeof rawLead.Contact_Consent_Timestamp__c === 'string' ? rawLead.Contact_Consent_Timestamp__c : null,
    };

    console.log('[getLeadAction] Lead data:', {
      id: lead.id,
      hasPhone: !!lead.phone,
      state: lead.state,
      insurance: lead.insurance,
      service: lead.service,
      consent: lead.consent,
      consentTimestamp: lead.consentTimestamp,
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
  /** Contact consent for calls/texts about appointments */
  consent?: boolean;
  posthogDistinctId?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export interface UpdateLeadInput {
  leadId: string;
  /** Insurance carrier name */
  insurance?: string;
  /** State code (e.g., 'NY', 'CA') */
  state?: string;
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
 * Extract duplicate lead ID from a Salesforce DUPLICATES_DETECTED error.
 * Returns the lead ID if found, null otherwise.
 */
function extractDuplicateLeadId(errorMessage: string): string | null {
  try {
    // Error format: "Salesforce API error: 400 [JSON array]"
    const jsonMatch = errorMessage.match(/\[[\s\S]*\]$/);
    if (!jsonMatch) return null;

    const errors = JSON.parse(jsonMatch[0]) as Array<{
      errorCode?: string;
      duplicateResult?: {
        matchResults?: Array<{
          matchRecords?: Array<{
            record?: { Id?: string };
          }>;
        }>;
      };
    }>;

    const duplicateError = errors.find((e) => e.errorCode === 'DUPLICATES_DETECTED');
    if (!duplicateError?.duplicateResult?.matchResults?.[0]?.matchRecords?.[0]?.record?.Id) {
      return null;
    }

    return duplicateError.duplicateResult.matchResults[0].matchRecords[0].record.Id;
  } catch {
    return null;
  }
}

/**
 * Create a new Salesforce lead when phone number is captured.
 * Uses the same field mapping as the Website - Online Booking source.
 * If a duplicate is detected, updates the existing lead instead.
 */
export async function createLeadAction(
  input: CreateLeadInput
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  const client = getSalesforceClient();

  // Transform service type to Salesforce boolean fields
  const serviceFields = input.service ? mapServiceToSalesforce(input.service) : {};
  
  // Transform consent to include timestamp (only on first consent)
  const consentFields = input.consent !== undefined ? mapConsentToSalesforce(input.consent) : {};

  // Get Salesforce field names from registry for optional fields
  const stateWriteField = getSalesforceWriteField(FieldId.STATE);
  const insuranceWriteField = getSalesforceWriteField(FieldId.INSURANCE);

  console.log('[createLeadAction] Creating lead with data:', {
    phone: input.phone,
    state: input.state,
    service: input.service,
    insurance: input.insurance,
    consent: input.consent,
    posthogDistinctId: input.posthogDistinctId,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
  });

  // --- Step 1: Get or create lead ID ---
  let leadId: string;
  let isNewLead = false;

  try {
    const leadData = {
      RecordTypeId: '0125w000000BRDxAAO',
      FirstName: 'TEST first',
      LastName: 'TEST last',
      LeadSource: 'Website - Online Booking',
      Status: 'New',
      Inquiry_Date__c: new Date().toISOString(),
      Phone: input.phone,
      ...(input.state && { [stateWriteField]: input.state }),
      ...(input.insurance && { [insuranceWriteField]: input.insurance }),
      ...serviceFields,
      ...consentFields,
      ...(input.utmSource && { UTM_Source__c: input.utmSource }),
      ...(input.utmMedium && { UTM_Medium__c: input.utmMedium }),
      ...(input.utmCampaign && { UTM_Campaign__c: input.utmCampaign }),
    };

    const result = await client.createLead(leadData);

    if (!result.success) {
      throw new Error(`Failed to create lead: ${JSON.stringify(result.errors)}`);
    }

    leadId = result.id;
    isNewLead = true;
  } catch (error) {
    // Check if this is a duplicate detection error
    const errorMessage = error instanceof Error ? error.message : '';
    const duplicateLeadId = extractDuplicateLeadId(errorMessage);

    if (!duplicateLeadId) {
      // Not a duplicate error - actual failure
      console.error('[createLeadAction] Failed to create Salesforce lead:', {
        error,
        params: {
          phone: input.phone ? `***${input.phone.slice(-4)}` : undefined,
          state: input.state,
          service: input.service,
          consent: input.consent,
          hasPosthogId: !!input.posthogDistinctId,
        },
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Duplicate detected - update existing lead
    console.log('[createLeadAction] Duplicate detected, updating existing lead:', duplicateLeadId);
    leadId = duplicateLeadId;

    try {
      const updateData: Record<string, unknown> = {
        Status: 'New', // Reset status so returning users get re-engaged
        ...(input.state && { [stateWriteField]: input.state }),
        ...(input.insurance && { [insuranceWriteField]: input.insurance }),
        ...serviceFields,
        ...consentFields,
        ...(input.utmSource && { UTM_Source__c: input.utmSource }),
        ...(input.utmMedium && { UTM_Medium__c: input.utmMedium }),
        ...(input.utmCampaign && { UTM_Campaign__c: input.utmCampaign }),
      };
      await client.updateLead(duplicateLeadId, updateData);
    } catch (updateError) {
      // Log but don't fail - we still have the lead ID
      console.error('[createLeadAction] Failed to update duplicate lead:', {
        error: updateError,
        leadId: duplicateLeadId,
      });
    }
  }

  // --- Step 2: Link to PostHog ---
  if (input.posthogDistinctId) {
    const posthog = PostHogClient();
    posthog.identify({
      distinctId: input.posthogDistinctId,
      properties: { salesforce_lead_id: leadId },
    });
    posthog.capture({
      distinctId: input.posthogDistinctId,
      event: isNewLead ? 'lead_created' : 'lead_updated_from_duplicate',
      properties: { salesforce_lead_id: leadId },
    });
    await posthog.flush();
  }

  console.log('[createLeadAction] Lead ID:', leadId);

  // --- Step 3: Start re-engagement careflow workflow (durable) ---
  try {
    const run = await start(reengagementCareflowWorkflow, [{
      salesforceLeadId: leadId,
      phone: input.phone,
      state: input.state ?? undefined,
    }]);
    console.log('[createLeadAction] Re-engagement workflow started:', { leadId, isNewLead, runId: run.runId });
  } catch (err) {
    console.error('[createLeadAction] Failed to start re-engagement workflow:', err);
  }

  return { success: true, leadId };
}

/**
 * Update an existing Salesforce lead with insurance or state info
 */
export async function updateLeadAction(
  input: UpdateLeadInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getSalesforceClient();

    const updateData: Record<string, unknown> = {};
    
    if (input.insurance) {
      const insuranceWriteField = getSalesforceWriteField(FieldId.INSURANCE);
      updateData[insuranceWriteField] = input.insurance;
    }
    
    if (input.state) {
      const stateWriteField = getSalesforceWriteField(FieldId.STATE);
      updateData[stateWriteField] = input.state;
    }
    
    if (Object.keys(updateData).length > 0) {
      console.log('[updateLeadAction] Updating lead with data:', {
        leadId: input.leadId,
        updateData
      });
      await client.updateLead(input.leadId, updateData);
    } else {
      console.log('[updateLeadAction] No data to update for lead:', { leadId: input.leadId });
    }

    return { success: true };
  } catch (error) {
    console.error('[updateLeadAction] Failed to update Salesforce lead:', {
      error,
      params: {
        leadId: input.leadId,
        hasInsurance: !!input.insurance,
        hasState: !!input.state,
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
