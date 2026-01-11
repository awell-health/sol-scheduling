'use server';

import { getSalesforceClient } from '@/lib/salesforce';
import PostHogClient from '../../../../posthog';
import { mapServiceToSalesforce, mapSalesforceToService, mapConsentToSalesforce, formatPhoneForSalesforce, normalizePhoneFromSalesforce } from './transformers';
import { FieldId, getSalesforceReadField, getSalesforceWriteField } from '@/lib/fields';
import { start } from 'workflow/api';
import { reengagementCareflowWorkflow } from '@/lib/workflow';

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
    // Normalize phone from Salesforce (handles both E.164 and formatted) to E.164 for internal storage
    const rawPhone = typeof rawLead[phoneField] === 'string' ? rawLead[phoneField] : null;
    const normalizedPhone = normalizePhoneFromSalesforce(rawPhone);
    
    const lead: SalesforceLeadData = {
      id: leadId,
      phone: normalizedPhone,
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

/**
 * Check if a Salesforce lead exists and is not converted.
 * 
 * @returns Object with exists (boolean) and isConverted (boolean) flags
 */
export async function checkLeadStatusAction(
  leadId: string
): Promise<{ success: boolean; exists?: boolean; isConverted?: boolean; error?: string }> {
  try {
    if (!leadId || leadId.trim().length === 0) {
      return { success: false, error: 'Lead ID is required' };
    }

    const client = getSalesforceClient();
    console.log('[checkLeadStatusAction] Checking lead status:', leadId);

    const rawLead = await client.getLead(leadId);
    
    // IsConverted is a standard Salesforce field (boolean)
    const isConverted = typeof rawLead.IsConverted === 'boolean' ? rawLead.IsConverted : false;
    const exists = rawLead.exists;

    console.log('[checkLeadStatusAction] Lead status:', {
      leadId,
      exists,
      isConverted,
    });

    return { 
      success: true, 
      exists: true, 
      isConverted 
    };
  } catch (error) {
    // If lead doesn't exist, Salesforce will return a 404 or similar error
    const errorMessage = error instanceof Error ? error.message : '';
    const isNotFound = errorMessage.includes('404') || 
                       errorMessage.includes('NOT_FOUND') ||
                       errorMessage.includes('does not exist');
    const isDeleted = errorMessage.includes('ENTITY_IS_DELETED');

    if (isNotFound || isDeleted) {
      console.log('[checkLeadStatusAction] Lead not found or deleted:', leadId);
      return { 
        success: true, 
        exists: false, 
        isConverted: false 
      };
    }

    console.error('[checkLeadStatusAction] Failed to check lead status:', {
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

export interface EnsureLeadExistsInput {
  /** Current lead ID to validate (if any) */
  currentLeadId?: string;
  /** Phone number (required for lead creation) */
  phone: string;
  /** State code (e.g., 'NY', 'CA') */
  state?: string | null;
  /** Service type (e.g., 'medication', 'therapy') */
  service?: string | null;
  /** Insurance carrier name */
  insurance?: string | null;
  /** Contact consent */
  consent?: boolean | null;
  /** PostHog distinct ID for analytics */
  posthogDistinctId?: string;
}

export interface EnsureLeadExistsResult {
  success: boolean;
  /** The valid lead ID (existing or newly created) */
  leadId?: string;
  /** Whether a new lead was created because the old one was invalid */
  wasRecreated?: boolean;
  error?: string;
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
    // Format phone number for Salesforce (E.164 → (xxx) xxx-xxxx)
    // If formatting fails, fall back to original phone (shouldn't happen for valid E.164)
    const formattedPhone = formatPhoneForSalesforce(input.phone) ?? input.phone;
    
    const leadData = {
      RecordTypeId: '0125w000000BRDxAAO',
      FirstName: 'No',
      LastName: 'Name Yet',
      LeadSource: 'Website - Online Booking',
      Status: 'New',
      Inquiry_Date__c: new Date().toISOString(),
      Phone: formattedPhone,
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
 * Helper to check if an error indicates the lead was deleted or converted.
 */
function isLeadDeletedOrConvertedError(errorMessage: string): boolean {
  return errorMessage.includes('ENTITY_IS_DELETED') || 
         errorMessage.includes('CONVERTED_LEAD') ||
         errorMessage.includes('cannot reference converted lead');
}

/**
 * Ensure a valid Salesforce lead exists.
 * 
 * If the current lead ID is invalid (deleted, converted, or doesn't exist),
 * creates a new lead with all the provided preferences.
 * 
 * This is useful when:
 * - A lead was created during onboarding but later deleted in Salesforce
 * - A lead was converted to a Contact/Account
 * - The lead ID in localStorage is stale
 * 
 * @returns Object with the valid lead ID and whether it was recreated
 */
export async function ensureLeadExistsAction(
  input: EnsureLeadExistsInput
): Promise<EnsureLeadExistsResult> {
  const { currentLeadId, phone, state, service, insurance, consent, posthogDistinctId } = input;

  console.log('[ensureLeadExistsAction] Checking lead validity:', {
    currentLeadId,
    hasPhone: !!phone,
    state,
    service,
    insurance,
    consent,
  });

  // If no current lead ID, we need to create one
  if (!currentLeadId) {
    console.log('[ensureLeadExistsAction] No lead ID provided, creating new lead');
    return await createNewLeadWithPreferences();
  }

  // Check if the lead exists and is valid
  try {
    const statusResult = await checkLeadStatusAction(currentLeadId);
    
    if (!statusResult.success) {
      console.log('[ensureLeadExistsAction] Failed to check lead status:', statusResult.error);
      // If we can't check status, try to create a new lead
      return await createNewLeadWithPreferences();
    }

    // If lead doesn't exist, create a new one
    if (!statusResult.exists) {
      console.log('[ensureLeadExistsAction] Lead does not exist, creating new lead');
      return await createNewLeadWithPreferences();
    }

    // If lead is converted, create a new one
    if (statusResult.isConverted) {
      console.log('[ensureLeadExistsAction] Lead is converted, creating new lead');
      return await createNewLeadWithPreferences();
    }

    // Lead exists and is valid
    console.log('[ensureLeadExistsAction] Lead is valid:', currentLeadId);
    return { success: true, leadId: currentLeadId, wasRecreated: false };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';
    
    // Check for specific deleted/converted errors
    if (isLeadDeletedOrConvertedError(errorMessage)) {
      console.log('[ensureLeadExistsAction] Lead was deleted or converted, creating new lead');
      return await createNewLeadWithPreferences();
    }

    console.error('[ensureLeadExistsAction] Unexpected error checking lead:', error);
    // Try to create a new lead as fallback
    return await createNewLeadWithPreferences();
  }

  // Helper function to create a new lead with all preferences
  async function createNewLeadWithPreferences(): Promise<EnsureLeadExistsResult> {
    const createResult = await createLeadAction({
      phone,
      state: state ?? undefined,
      service: service ?? undefined,
      insurance: insurance ?? undefined,
      consent: consent ?? undefined,
      posthogDistinctId,
    });

    if (!createResult.success || !createResult.leadId) {
      console.error('[ensureLeadExistsAction] Failed to create new lead:', createResult.error);
      return {
        success: false,
        error: createResult.error ?? 'Failed to create new lead',
      };
    }

    console.log('[ensureLeadExistsAction] Created new lead:', createResult.leadId);
    return {
      success: true,
      leadId: createResult.leadId,
      wasRecreated: true,
    };
  }
}

