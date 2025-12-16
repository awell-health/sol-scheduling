/**
 * Salesforce field transformation utilities.
 * Handles mapping between form values and Salesforce field structures.
 */

/**
 * Service type values used in the UI/form.
 */
export type ServiceType = 'Psychiatric' | 'Therapy' | 'Both' | 'Not Sure';

/**
 * Maps a service type selection to Salesforce boolean fields.
 * 
 * Mapping:
 * - "Psychiatric" (Medication in UI) → Medication__c = true
 * - "Therapy" → Therapy__c = true
 * - "Both" → both = true
 * - "Not Sure" → both = true
 */
export function mapServiceToSalesforce(service: string | null | undefined): {
  Medication__c: boolean;
  Therapy__c: boolean;
} {
  switch (service) {
    case 'Psychiatric': // "Medication" in UI
      return { Medication__c: true, Therapy__c: false };
    case 'Therapy':
      return { Medication__c: false, Therapy__c: true };
    case 'Both':
    case 'Not Sure':
      return { Medication__c: true, Therapy__c: true };
    default:
      return { Medication__c: false, Therapy__c: false };
  }
}

/**
 * Maps Salesforce boolean fields back to a service type string.
 * Used when reading lead data from Salesforce.
 * 
 * Reverse mapping:
 * - Both true → "Both"
 * - Only Medication__c → "Psychiatric"
 * - Only Therapy__c → "Therapy"
 * - Neither → null
 */
export function mapSalesforceToService(
  medication: boolean | null,
  therapy: boolean | null
): string | null {
  if (medication && therapy) return 'Both';
  if (medication) return 'Psychiatric';
  if (therapy) return 'Therapy';
  return null;
}

/**
 * Generates consent fields for Salesforce write operations.
 * Includes boolean consent and ISO 8601 UTC timestamp.
 * 
 * @param consent - The consent boolean value
 * @returns Object with Contact_Consent__c and Contact_Consent_Timestamp__c
 */
export function mapConsentToSalesforce(consent: boolean | null | undefined): {
  Contact_Consent__c: boolean;
  Contact_Consent_Timestamp__c?: string;
} {
  if (consent === true) {
    return {
      Contact_Consent__c: true,
      Contact_Consent_Timestamp__c: new Date().toISOString(),
    };
  }
  return {
    Contact_Consent__c: consent ?? false,
  };
}

