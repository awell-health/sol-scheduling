import type { SalesforceLeadData } from './actions';

const LEAD_STORAGE_KEY = '_slc';
const LEAD_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface StoredLead {
  leadId: string;
  phone: string;
  createdAt: string;
  /** Full lead data from Salesforce (when fetched via slc param) */
  leadData?: SalesforceLeadData;
}

/**
 * Check if stored lead data has expired (older than 1 hour).
 * Returns the stored data if valid, null if expired or missing.
 */
function getStoredLeadIfValid(): StoredLead | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    
    const data: StoredLead = JSON.parse(raw);
    const createdAt = new Date(data.createdAt);
    const now = new Date();
    const ageMs = now.getTime() - createdAt.getTime();
    
    // Check if expired (older than 1 hour)
    if (ageMs > LEAD_EXPIRY_MS) {
      localStorage.removeItem(LEAD_STORAGE_KEY);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * Store the Salesforce lead ID in localStorage
 */
export function storeLeadId(leadId: string, phone: string): void {
  if (typeof window === 'undefined') return;
  
  const data: StoredLead = {
    leadId,
    phone: phone.replace(/\D/g, ''), // Store normalized phone
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Get the stored lead ID if it matches the given phone.
 * Automatically clears if expired (older than 1 hour).
 * 
 * @returns Object with leadId and wasExpired flag, or null if not found/expired
 */
export function getStoredLeadId(phone: string): { leadId: string; wasExpired: boolean } | null {
  if (typeof window === 'undefined') return null;
  
  const data = getStoredLeadIfValid();
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
 * Automatically clears if expired (older than 1 hour).
 * 
 * @returns Object with leadId and wasExpired flag, or null if not found/expired
 */
export function getAnyStoredLeadId(): { leadId: string; wasExpired: boolean } | null {
  if (typeof window === 'undefined') return null;
  
  const data = getStoredLeadIfValid();
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
 */
export function storeLeadFromSalesforce(leadData: SalesforceLeadData): void {
  if (typeof window === 'undefined') return;
  
  const data: StoredLead = {
    leadId: leadData.id,
    phone: leadData.phone?.replace(/\D/g, '') ?? '',
    createdAt: new Date().toISOString(),
    leadData,
  };
  
  localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Get the full stored lead data (if available).
 * Automatically clears if expired (older than 1 hour).
 */
export function getStoredLeadData(): SalesforceLeadData | null {
  if (typeof window === 'undefined') return null;
  
  const data = getStoredLeadIfValid();
  return data?.leadData ?? null;
}

