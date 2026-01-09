import type { SalesforceLeadData } from './actions';
import { clearPreferencesStorage, STORAGE_KEYS as ONBOARDING_STORAGE_KEYS } from '../onboarding/storage';

const LEAD_STORAGE_KEY = '_slc';

interface StoredLead {
  leadId: string;
  phone: string;
  createdAt: string;
  /** Full lead data from Salesforce (when fetched via slc param) */
  leadData?: SalesforceLeadData;
}

/**
 * Check if localStorage is available (handles private browsing, disabled storage, etc.).
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__sol_slc_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get stored lead data if available.
 * Returns the stored data, or null if missing.
 */
function getStoredLead(): StoredLead | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const raw = localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    
    return JSON.parse(raw) as StoredLead;
  } catch {
    return null;
  }
}

/**
 * Store the Salesforce lead ID in localStorage.
 * Silently fails if localStorage is unavailable (e.g., disabled in browser).
 */
export function storeLeadId(leadId: string, phone: string): void {
  if (!isLocalStorageAvailable()) {
    console.warn('[Salesforce Storage] localStorage unavailable, cannot store lead ID');
    return;
  }
  
  try {
    const data: StoredLead = {
      leadId,
      phone: phone.replace(/\D/g, ''), // Store normalized phone
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('[Salesforce Storage] Failed to store lead ID:', error);
  }
}

/**
 * Get the stored lead ID if it matches the given phone.
 * 
 * @returns Object with leadId and wasExpired flag, or null if not found
 */
export function getStoredLeadId(phone: string): { leadId: string; wasExpired: boolean } | null {
  if (typeof window === 'undefined') return null;
  
  const data = getStoredLead();
  if (!data) return null;
  
  const normalizedPhone = phone.replace(/\D/g, '');
  
  // Only return if phone matches (same person)
  if (data.phone === normalizedPhone) {
    return { leadId: data.leadId, wasExpired: false };
  }
  
  return null;
}

/**
 * Get any stored lead ID regardless of phone.
 * 
 * @returns Object with leadId and wasExpired flag, or null if not found
 */
export function getAnyStoredLeadId(): { leadId: string; wasExpired: boolean } | null {
  if (typeof window === 'undefined') return null;
  
  const data = getStoredLead();
  if (!data) return null;
  
  return { leadId: data.leadId, wasExpired: false };
}

/**
 * Clear the stored lead ID.
 * 
 * @returns The lead ID that was cleared, or null if none existed
 */
export function clearStoredLeadId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    
    const data: StoredLead = JSON.parse(raw);
    const leadId = data.leadId;
    localStorage.removeItem(LEAD_STORAGE_KEY);
    return leadId;
  } catch {
    localStorage.removeItem(LEAD_STORAGE_KEY);
    return null;
  }
}

/**
 * Store lead data fetched from Salesforce (via slc param).
 * Stores the full lead data for later reference.
 * Silently fails if localStorage is unavailable.
 */
export function storeLeadFromSalesforce(leadData: SalesforceLeadData): void {
  if (!isLocalStorageAvailable()) {
    console.warn('[Salesforce Storage] localStorage unavailable, cannot store lead data');
    return;
  }
  
  try {
    const data: StoredLead = {
      leadId: leadData.id,
      phone: leadData.phone?.replace(/\D/g, '') ?? '',
      createdAt: new Date().toISOString(),
      leadData,
    };
    
    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('[Salesforce Storage] Failed to store lead data:', error);
  }
}

/**
 * Get the full stored lead data (if available).
 */
export function getStoredLeadData(): SalesforceLeadData | null {
  if (typeof window === 'undefined') return null;
  
  const data = getStoredLead();
  return data?.leadData ?? null;
}

/**
 * Clear all booking-related storage on successful booking.
 * Clears both the lead ID (_slc) and onboarding preferences (sol.onboarding).
 * 
 * @returns The lead ID that was cleared, or null if none existed
 */
export function clearAllBookingStorage(): string | null {
  // Clear lead ID storage
  const clearedLeadId = clearStoredLeadId();
  
  // Clear onboarding preferences
  clearPreferencesStorage();
  
  console.log('[Salesforce Storage] Cleared all booking storage:', {
    clearedLeadId,
    clearedOnboarding: ONBOARDING_STORAGE_KEYS.ONBOARDING,
  });
  
  return clearedLeadId;
}

