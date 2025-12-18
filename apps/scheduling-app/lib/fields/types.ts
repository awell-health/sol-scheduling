import { z } from 'zod';

/**
 * Unique identifiers for all collectible fields.
 * Used across onboarding, booking, and Salesforce sync.
 */
export enum FieldId {
  // Onboarding fields
  STATE = 'state',
  SERVICE = 'service',
  PHONE = 'phone',
  INSURANCE = 'insurance',
  CONSENT = 'consent',
  
  // Booking fields
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
}

/**
 * Input types determine which component renders the field.
 */
export type FieldInputType =
  | 'text'
  | 'phone'
  | 'select'
  | 'autocomplete'
  | 'checkbox'
  | 'state-select';

/**
 * Where a field can be asked.
 */
export type FieldContext = 'onboarding' | 'booking';

/**
 * Salesforce field mapping for read/write operations.
 */
export interface SalesforceFieldMapping {
  /** Field name when reading from Salesforce (e.g., 'Phone', 'Market__c') */
  read: string;
  /** Field name when writing to Salesforce (usually same as read) */
  write: string;
}

/**
 * Option for select/autocomplete fields.
 */
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * Complete definition of a collectible field.
 */
export interface FieldDefinition {
  /** Unique identifier */
  id: FieldId;
  
  /** Human-readable label (shown above input) */
  label: string;
  
  /** Helper text (shown below input) */
  description?: string;
  
  /** Placeholder text for the input */
  placeholder?: string;
  
  /** Question text for conversational flows (e.g., "What is your phone number?") */
  conversationalQuestion?: string;
  
  /** Description for conversational flows (more detailed than standard description) */
  conversationalDescription?: string;
  
  /** Input type (determines component) */
  inputType: FieldInputType;
  
  /** Zod validation schema */
  validation: z.ZodTypeAny;
  
  /** Salesforce field mapping */
  salesforce: SalesforceFieldMapping;
  
  /** Key in localStorage (sol.onboarding) - null if not stored */
  storageKey: string | null;
  
  /** Where this field can appear */
  contexts: FieldContext[];
  
  /** Feature flag that enables this field (if any) */
  featureFlag?: string;
  
  /** Whether field is required (default: true) */
  required?: boolean;
  
  /** Options for select/autocomplete fields */
  options?: FieldOption[];
}

/**
 * Collected field values (used for form state).
 */
export type FieldValues = Partial<Record<FieldId, string | boolean | null>>;

