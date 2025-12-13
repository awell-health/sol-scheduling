import type { SalesforceLeadData } from './actions';

const LEAD_STORAGE_KEY = '_slc';

interface StoredLead {
  leadId: string;
  phone: string;
  createdAt: string;
  /** Full lead data from Salesforce (when fetched via slc param) */
  leadData?: SalesforceLeadData;
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
 * Get the stored lead ID if it matches the given phone
 */
export function getStoredLeadId(phone: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    
    const data: StoredLead = JSON.parse(raw);
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Only return if phone matches (same person)
    if (data.phone === normalizedPhone) {
      return data.leadId;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Get any stored lead ID regardless of phone
 */
export function getAnyStoredLeadId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    
    const data: StoredLead = JSON.parse(raw);
    return data.leadId;
  } catch {
    return null;
  }
}

/**
 * Clear the stored lead ID
 */
export function clearStoredLeadId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEAD_STORAGE_KEY);
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
 * Get the full stored lead data (if available)
 */
export function getStoredLeadData(): SalesforceLeadData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    
    const data: StoredLead = JSON.parse(raw);
    return data.leadData ?? null;
  } catch {
    return null;
  }
}

