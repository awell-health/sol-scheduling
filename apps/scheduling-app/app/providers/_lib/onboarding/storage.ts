import type { OnboardingPreferences } from './types';
import { FieldId, ONBOARDING_STORAGE_KEYS } from '@/lib/fields';

/**
 * Single localStorage key for all onboarding data.
 * Stores preferences as a JSON object (similar to Statsig pattern).
 */
export const STORAGE_KEYS = {
  ONBOARDING: 'sol.onboarding'
} as const;

// Storage keys from the field registry - single source of truth
const KEYS = {
  state: ONBOARDING_STORAGE_KEYS[FieldId.STATE],
  service: ONBOARDING_STORAGE_KEYS[FieldId.SERVICE],
  phone: ONBOARDING_STORAGE_KEYS[FieldId.PHONE],
  insurance: ONBOARDING_STORAGE_KEYS[FieldId.INSURANCE],
  consent: ONBOARDING_STORAGE_KEYS[FieldId.CONSENT],
} as const;

/**
 * Shape of the stored onboarding data.
 * Keys derived from the field registry.
 */
interface StoredOnboardingData {
  [key: string]: string | boolean | undefined;
  updatedAt?: string;
}

/**
 * Check if localStorage is available (handles private browsing).
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__sol_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read the raw stored onboarding data
 */
function readStoredData(): StoredOnboardingData | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.ONBOARDING);
    if (!raw) return null;
    return JSON.parse(raw) as StoredOnboardingData;
  } catch {
    return null;
  }
}

/**
 * Read all onboarding preferences from localStorage.
 * Uses storage keys from the field registry.
 */
export function readPreferencesFromStorage(): OnboardingPreferences {
  const data = readStoredData();
  
  if (!data) {
    return { state: null, service: null, phone: null, insurance: null, consent: null };
  }

  return {
    state: (data[KEYS.state] as string) ?? null,
    service: (data[KEYS.service] as string) ?? null,
    phone: (data[KEYS.phone] as string) ?? null,
    insurance: (data[KEYS.insurance] as string) ?? null,
    consent: (data[KEYS.consent] as boolean) ?? null
  };
}

/**
 * Write onboarding preferences to localStorage.
 * Merges with existing data; null/empty values remove that key.
 * Uses storage keys from the field registry.
 */
export function writePreferencesToStorage(
  prefs: Partial<OnboardingPreferences>
): void {
  if (!isLocalStorageAvailable()) return;

  // Read existing data
  const existing = readStoredData() ?? {};
  
  // Merge preferences
  const updated: StoredOnboardingData = { ...existing };
  
  // Handle string preferences using registry keys
  const stringFields: Array<{ pref: keyof OnboardingPreferences; key: string }> = [
    { pref: 'state', key: KEYS.state },
    { pref: 'service', key: KEYS.service },
    { pref: 'phone', key: KEYS.phone },
    { pref: 'insurance', key: KEYS.insurance },
  ];
  
  for (const { pref, key } of stringFields) {
    if (pref in prefs) {
      const value = prefs[pref];
      if (value === null || value === undefined || value === '') {
        delete updated[key];
      } else {
        updated[key] = value as string;
      }
    }
  }
  
  // Handle consent (boolean) using registry key
  if ('consent' in prefs) {
    if (prefs.consent === null || prefs.consent === undefined) {
      delete updated[KEYS.consent];
    } else {
      updated[KEYS.consent] = prefs.consent;
    }
  }
  
  // Add timestamp
  updated.updatedAt = new Date().toISOString();
  
  // Write back as single JSON object
  window.localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(updated));
}

/**
 * Clear all onboarding preferences from localStorage.
 */
export function clearPreferencesStorage(): void {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
}

/**
 * Get the stored phone number (useful for pre-filling forms)
 * Uses storage key from the field registry.
 */
export function getStoredPhone(): string | null {
  const data = readStoredData();
  return (data?.[KEYS.phone] as string) ?? null;
}

