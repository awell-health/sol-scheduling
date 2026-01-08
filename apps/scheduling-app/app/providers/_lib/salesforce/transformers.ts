/**
 * Salesforce field transformation utilities.
 * Handles mapping between form values and Salesforce field structures.
 */

import { parsePhoneNumberFromString, formatNumber } from 'libphonenumber-js';

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
 * - "Not Sure" → neither (both = false)
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
      return { Medication__c: true, Therapy__c: true };
    case 'Not Sure':
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

/**
 * Formats a phone number for writing to Salesforce.
 * Converts E.164 format (e.g., "+19175551234") to US format (e.g., "(917) 555-1234").
 * 
 * @param phone - Phone number in E.164 format
 * @returns Formatted phone number string, or null if invalid
 */
export function formatPhoneForSalesforce(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, 'US');
    if (!phoneNumber || !phoneNumber.isValid()) {
      return null;
    }
    
    // Format as (xxx) xxx-xxxx for US numbers
    return formatNumber(phoneNumber.number, 'NATIONAL');
  } catch {
    // If parsing fails, return null
    return null;
  }
}

/**
 * Normalizes a phone number from Salesforce to E.164 format.
 * Handles both E.164 format (e.g., "+19175551234") and formatted US numbers (e.g., "(917) 555-1234").
 * 
 * @param phone - Phone number from Salesforce (can be E.164 or formatted)
 * @returns Phone number in E.164 format, or null if invalid
 */
export function normalizePhoneFromSalesforce(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  try {
    // Try parsing as-is (handles E.164 like "+19175551234")
    const phoneNumber = parsePhoneNumberFromString(phone, 'US');
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.number; // Returns E.164 format
    }
  } catch {
    // Fall through to digit extraction
  }
  
  // If parsing fails, try extracting digits and reconstructing
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) {
    try {
      // If 10 digits, assume US and add +1
      const e164 = digits.length === 10 ? `+1${digits}` : `+${digits}`;
      const phoneNumber = parsePhoneNumberFromString(e164, 'US');
      if (phoneNumber && phoneNumber.isValid()) {
        return phoneNumber.number;
      }
    } catch (error) {
      console.error(`[normalizePhoneFromSalesforce] Failed to normalize phone number '${phone}' from Salesforce:`, error);
    }
  }
  
  return null;
}

