import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  mapServiceToSalesforce,
  mapSalesforceToService,
  mapConsentToSalesforce,
  formatPhoneForSalesforce,
  normalizePhoneFromSalesforce
} from '../transformers';

describe('mapServiceToSalesforce', () => {
  it('maps "Psychiatric" to Medication only', () => {
    expect(mapServiceToSalesforce('Psychiatric')).toEqual({
      Medication__c: true,
      Therapy__c: false
    });
  });

  it('maps "Therapy" to Therapy only', () => {
    expect(mapServiceToSalesforce('Therapy')).toEqual({
      Medication__c: false,
      Therapy__c: true
    });
  });

  it('maps "Both" to both fields', () => {
    expect(mapServiceToSalesforce('Both')).toEqual({
      Medication__c: true,
      Therapy__c: true
    });
  });

  it('maps "Not Sure" to neither field', () => {
    expect(mapServiceToSalesforce('Not Sure')).toEqual({
      Medication__c: false,
      Therapy__c: false
    });
  });

  it('maps null to neither field', () => {
    expect(mapServiceToSalesforce(null)).toEqual({
      Medication__c: false,
      Therapy__c: false
    });
  });

  it('maps undefined to neither field', () => {
    expect(mapServiceToSalesforce(undefined)).toEqual({
      Medication__c: false,
      Therapy__c: false
    });
  });

  it('maps unknown values to neither field', () => {
    expect(mapServiceToSalesforce('SomeOtherValue')).toEqual({
      Medication__c: false,
      Therapy__c: false
    });
  });
});

describe('mapSalesforceToService', () => {
  it('maps both true to "Both"', () => {
    expect(mapSalesforceToService(true, true)).toBe('Both');
  });

  it('maps medication only to "Psychiatric"', () => {
    expect(mapSalesforceToService(true, false)).toBe('Psychiatric');
  });

  it('maps therapy only to "Therapy"', () => {
    expect(mapSalesforceToService(false, true)).toBe('Therapy');
  });

  it('maps neither to null', () => {
    expect(mapSalesforceToService(false, false)).toBeNull();
  });

  it('handles null medication with therapy true', () => {
    expect(mapSalesforceToService(null, true)).toBe('Therapy');
  });

  it('handles null therapy with medication true', () => {
    expect(mapSalesforceToService(true, null)).toBe('Psychiatric');
  });

  it('handles both null', () => {
    expect(mapSalesforceToService(null, null)).toBeNull();
  });
});

describe('mapConsentToSalesforce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T10:30:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('maps true consent with timestamp', () => {
    const result = mapConsentToSalesforce(true);
    expect(result).toEqual({
      Contact_Consent__c: true,
      Contact_Consent_Timestamp__c: '2024-06-15T10:30:00.000Z'
    });
  });

  it('maps false consent without timestamp', () => {
    const result = mapConsentToSalesforce(false);
    expect(result).toEqual({
      Contact_Consent__c: false
    });
  });

  it('maps null consent to false without timestamp', () => {
    const result = mapConsentToSalesforce(null);
    expect(result).toEqual({
      Contact_Consent__c: false
    });
  });

  it('maps undefined consent to false without timestamp', () => {
    const result = mapConsentToSalesforce(undefined);
    expect(result).toEqual({
      Contact_Consent__c: false
    });
  });
});

describe('formatPhoneForSalesforce', () => {
  it('formats E.164 to national format', () => {
    expect(formatPhoneForSalesforce('+19175551234')).toBe('(917) 555-1234');
  });

  it('formats 10-digit numbers', () => {
    expect(formatPhoneForSalesforce('+13035551234')).toBe('(303) 555-1234');
  });

  it('returns null for null input', () => {
    expect(formatPhoneForSalesforce(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(formatPhoneForSalesforce(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(formatPhoneForSalesforce('')).toBeNull();
  });

  it('returns null for invalid phone numbers', () => {
    expect(formatPhoneForSalesforce('+1123')).toBeNull();
  });
});

describe('normalizePhoneFromSalesforce', () => {
  it('keeps E.164 format as-is', () => {
    expect(normalizePhoneFromSalesforce('+19175551234')).toBe('+19175551234');
  });

  it('converts national format to E.164', () => {
    expect(normalizePhoneFromSalesforce('(917) 555-1234')).toBe('+19175551234');
  });

  it('converts plain 10-digit to E.164', () => {
    expect(normalizePhoneFromSalesforce('9175551234')).toBe('+19175551234');
  });

  it('converts 11-digit with leading 1 to E.164', () => {
    expect(normalizePhoneFromSalesforce('19175551234')).toBe('+19175551234');
  });

  it('handles dashes and spaces', () => {
    expect(normalizePhoneFromSalesforce('917-555-1234')).toBe('+19175551234');
    expect(normalizePhoneFromSalesforce('917 555 1234')).toBe('+19175551234');
  });

  it('returns null for null input', () => {
    expect(normalizePhoneFromSalesforce(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizePhoneFromSalesforce(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(normalizePhoneFromSalesforce('')).toBeNull();
  });

  it('returns null for invalid phone numbers', () => {
    expect(normalizePhoneFromSalesforce('123')).toBeNull();
    expect(normalizePhoneFromSalesforce('abcdefghij')).toBeNull();
  });
});
