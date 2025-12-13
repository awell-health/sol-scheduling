import type { OnboardingPreferences } from './types';

/**
 * Single localStorage key for all onboarding data.
 * Stores preferences as a JSON object (similar to Statsig pattern).
 */
export const STORAGE_KEYS = {
  ONBOARDING: 'sol.onboarding'
} as const;

/**
 * Shape of the stored onboarding data
 */
interface StoredOnboardingData {
  state?: string;
  service?: string;
  phone?: string;
  insurance?: string;
  consent?: boolean;
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
 */
export function readPreferencesFromStorage(): OnboardingPreferences {
  const data = readStoredData();
  
  if (!data) {
    return { state: null, service: null, phone: null, insurance: null, consent: null };
  }

  return {
    state: data.state ?? null,
    service: data.service ?? null,
    phone: data.phone ?? null,
    insurance: data.insurance ?? null,
    consent: data.consent ?? null
  };
}

/**
 * Write onboarding preferences to localStorage.
 * Merges with existing data; null/empty values remove that key.
 */
export function writePreferencesToStorage(
  prefs: Partial<OnboardingPreferences>
): void {
  if (!isLocalStorageAvailable()) return;

  // Read existing data
  const existing = readStoredData() ?? {};
  
  // Merge preferences
  const updated: StoredOnboardingData = { ...existing };
  
  // Handle string preferences
  for (const key of ['state', 'service', 'phone', 'insurance'] as const) {
    if (key in prefs) {
      const value = prefs[key];
      if (value === null || value === undefined || value === '') {
        delete updated[key];
      } else {
        updated[key] = value;
      }
    }
  }
  
  // Handle consent (boolean)
  if ('consent' in prefs) {
    if (prefs.consent === null || prefs.consent === undefined) {
      delete updated.consent;
    } else {
      updated.consent = prefs.consent;
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
 */
export function getStoredPhone(): string | null {
  const data = readStoredData();
  return data?.phone ?? null;
}

