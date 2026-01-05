import { z } from 'zod';
import { isValidPhoneNumber } from '../../components/ui/phone-input';
import { FieldId, type FieldDefinition, type FieldOption } from './types';

// =============================================================================
// OPTIONS
// =============================================================================

/**
 * Insurance carrier options.
 */
export const INSURANCE_OPTIONS: FieldOption[] = [
  { value: 'Aetna', label: 'Aetna' },
  { value: 'Allegiance', label: 'Allegiance' },
  { value: 'BCBS - Anthem', label: 'BCBS - Anthem' },
  { value: 'BCBS - Empire', label: 'BCBS - Empire' },
  { value: 'BCBS - Carefirst', label: 'BCBS - Carefirst' },
  { value: 'BCBS - TX', label: 'BCBS - TX' },
  { value: 'Cigna', label: 'Cigna' },
  { value: 'Elevance / Carelon', label: 'Elevance / Carelon' },
  { value: 'EmblemHealth', label: 'EmblemHealth' },
  { value: 'First Health', label: 'First Health' },
  { value: 'Healthfirst', label: 'Healthfirst' },
  { value: 'Kaiser', label: 'Kaiser' },
  { value: 'Magnacare', label: 'Magnacare' },
  { value: 'Medicaid', label: 'Medicaid' },
  { value: 'Medicare', label: 'Medicare' },
  { value: 'Multiplan / Claritev', label: 'Multiplan / Claritev' },
  { value: 'Northwell Direct', label: 'Northwell Direct' },
  { value: 'Optum', label: 'Optum' },
  { value: 'Oscar', label: 'Oscar' },
  { value: 'Oxford', label: 'Oxford' },
  { value: 'Tricare', label: 'Tricare' },
  { value: 'UMR', label: 'UMR' },
  { value: 'UnitedHealthcare', label: 'UnitedHealthcare' },
  { value: '1199', label: '1199' },
  { value: 'Other', label: 'Other' },
  { value: 'Self-pay', label: 'Self-pay / No insurance' },
];

/**
 * Service type options.
 */
export const SERVICE_OPTIONS: FieldOption[] = [
  { value: 'Psychiatric', label: 'Medication' },
  { value: 'Therapy', label: 'Therapy' },
  { value: 'Both', label: 'Both' },
  { value: 'Not Sure', label: 'Not sure' },
];

/**
 * Extended service options with descriptions (for conversational form).
 */
export const SERVICE_OPTIONS_WITH_DESCRIPTIONS = [
  {
    value: 'Psychiatric',
    label: 'Medication',
    description:
      'Meet with a medical provider to talk through your situation and evaluate different medication options.',
  },
  {
    value: 'Therapy',
    label: 'Therapy',
    description:
      'Meet with a therapist to talk through your issues and build personal support.',
  },
  {
    value: 'Both',
    label: 'Both',
    description: 'A combination of medication and talk therapy.',
  },
  {
    value: 'Not Sure',
    label: 'Not sure',
    description: 'Help deciding what type of care is right for you.',
  },
];

/**
 * All US states.
 */
export const STATE_OPTIONS: FieldOption[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'DC', label: 'Washington DC' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

/**
 * Alias for backward compatibility with existing components.
 */
export const ALL_US_STATES = STATE_OPTIONS.map(opt => ({ code: opt.value, name: opt.label }));

/**
 * States that SOL currently services.
 */
export const SUPPORTED_STATE_CODES = [
  'AZ', 'CO', 'CT', 'FL', 'IL', 'MD', 'NJ', 'NY', 'TX', 'VA',
] as const;

export type SupportedStateCode = (typeof SUPPORTED_STATE_CODES)[number];

export function isSupportedState(code: string): code is SupportedStateCode {
  return SUPPORTED_STATE_CODES.includes(code as SupportedStateCode);
}

// =============================================================================
// FIELD DEFINITIONS
// =============================================================================

/**
 * Field registry - the single source of truth for all collectible fields.
 */
export const FIELD_REGISTRY: Record<FieldId, FieldDefinition> = {
  [FieldId.STATE]: {
    id: FieldId.STATE,
    label: 'State',
    description: 'We need this to match you with licensed providers.',
    placeholder: 'Select your state',
    conversationalQuestion: 'In what state are you located?',
    conversationalDescription:
      "We'll use this to show you providers who are licensed to practice in your state.",
    inputType: 'state-select',
    validation: z.string().min(2, 'Please select your state'),
    salesforce: {
      read: 'Market__c',
      write: 'Market__c',
    },
    storageKey: 'state',
    contexts: ['onboarding'],
    required: true,
    options: STATE_OPTIONS,
  },

  [FieldId.SERVICE]: {
    id: FieldId.SERVICE,
    label: 'Service type',
    placeholder: 'Select service type',
    conversationalQuestion: 'What type of help are you seeking?',
    conversationalDescription:
      'Choose the type of care that fits best right now. You can always change this later.',
    inputType: 'select',
    validation: z.string().min(1, 'Please select a service type'),
    // NOTE: This field maps to TWO Salesforce boolean fields (Medication__c, Therapy__c)
    // Transformation is handled in transformers.ts: mapServiceToSalesforce / mapSalesforceToService
    salesforce: {
      read: 'Medication__c,Therapy__c',
      write: 'Medication__c,Therapy__c',
    },
    storageKey: 'service',
    contexts: ['onboarding'],
    required: true,
    options: SERVICE_OPTIONS,
  },

  [FieldId.PHONE]: {
    id: FieldId.PHONE,
    label: 'Mobile number',
    description:
      "We'll use your phone number to confirm your appointment and send updates and reminders.",
    placeholder: '(555) 555-5555',
    conversationalQuestion: 'What is your phone number?',
    conversationalDescription:
      "We'll use your phone number to confirm your appointment and send updates and reminders.",
    inputType: 'phone',
    validation: z
      .string()
      .nonempty('Mobile number is required')
      .refine(
        (value) => {
          try {
            return isValidPhoneNumber(value, 'US');
          } catch {
            return false;
          }
        },
        { message: 'Please enter a valid U.S. phone number.' }
      ),
    salesforce: {
      read: 'Phone',
      write: 'Phone',
    },
    storageKey: 'phone',
    contexts: ['onboarding', 'booking'],
    required: true,
  },

  [FieldId.INSURANCE]: {
    id: FieldId.INSURANCE,
    label: 'Insurance',
    description:
      "Please confirm your coverage. If you're not sure, you can leave this blank.",
    placeholder: 'Search insurance carriers…',
    conversationalQuestion: 'What insurance do you have?',
    conversationalDescription:
      'This helps us show you providers who accept your insurance. You can update this later if needed.',
    inputType: 'autocomplete',
    validation: z.string().optional(),
    salesforce: {
      read: 'Insurance_Company_Name__c',
      write: 'Insurance_Company_Name__c',
    },
    storageKey: 'insurance',
    contexts: ['onboarding', 'booking'],
    required: false,
    options: INSURANCE_OPTIONS,
  },

  [FieldId.CONSENT]: {
    id: FieldId.CONSENT,
    label:
      'I consent to receiving calls or text messages at this number about scheduling details (not for marketing messages).',
    inputType: 'checkbox',
    validation: z.boolean().refine((val) => val === true, {
      message: 'You must consent to receiving calls or text messages about scheduling details.',
    }),
    // NOTE: Write also includes Contact_Consent_Timestamp__c (ISO 8601 UTC, set on first consent only)
    // Transformation is handled in transformers.ts: mapConsentToSalesforce
    salesforce: {
      read: 'Contact_Consent__c',
      write: 'Contact_Consent__c,Contact_Consent_Timestamp__c',
    },
    storageKey: 'consent',
    contexts: ['onboarding', 'booking'],
    required: true,
  },

  [FieldId.FIRST_NAME]: {
    id: FieldId.FIRST_NAME,
    label: 'First name',
    placeholder: 'Enter your first name',
    inputType: 'text',
    validation: z.string().min(1, 'First name is required'),
    salesforce: {
      read: 'FirstName',
      write: 'FirstName',
    },
    storageKey: 'firstName',
    contexts: ['booking'],
    required: true,
  },

  [FieldId.LAST_NAME]: {
    id: FieldId.LAST_NAME,
    label: 'Last name',
    placeholder: 'Enter your last name',
    inputType: 'text',
    validation: z.string().min(1, 'Last name is required'),
    salesforce: {
      read: 'LastName',
      write: 'LastName',
    },
    storageKey: 'lastName',
    contexts: ['booking'],
    required: true,
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a field definition by ID.
 */
export function getField(id: FieldId): FieldDefinition {
  return FIELD_REGISTRY[id];
}

/**
 * Get all fields for a specific context (onboarding or booking).
 */
export function getFieldsForContext(context: 'onboarding' | 'booking'): FieldDefinition[] {
  return Object.values(FIELD_REGISTRY).filter((field) =>
    field.contexts.includes(context)
  );
}

/**
 * Get all fields that have Salesforce mapping.
 * Useful for building read/write operations dynamically.
 */
export function getSalesforceFieldMap(): Record<string, { read: string; write: string }> {
  const map: Record<string, { read: string; write: string }> = {};
  for (const field of Object.values(FIELD_REGISTRY)) {
    map[field.id] = field.salesforce;
  }
  return map;
}

/**
 * Build a Zod schema from a list of field IDs.
 * Useful for creating form validation schemas from the registry.
 */
export function buildSchemaFromFields(fieldIds: FieldId[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const id of fieldIds) {
    const field = FIELD_REGISTRY[id];
    if (field) {
      shape[id] = field.validation;
    }
  }
  return z.object(shape);
}

/**
 * Build a Zod schema for booking form fields.
 * Includes all fields in the 'booking' context plus visitMode.
 */
export function buildBookingFormSchema() {
  const bookingFields = getFieldsForContext('booking');
  const shape: Record<string, z.ZodTypeAny> = {};
  
  for (const field of bookingFields) {
    shape[field.id] = field.validation;
  }
  
  // visitMode is slot-dependent, not in registry
  shape.visitMode = z.enum(['In-Person', 'Telehealth']).optional();
  
  return z.object(shape);
}

/**
 * Get the Salesforce read field name for a field ID.
 * Returns the raw field name(s) from the registry.
 */
export function getSalesforceReadField(fieldId: FieldId): string {
  return FIELD_REGISTRY[fieldId].salesforce.read;
}

/**
 * Get the Salesforce write field name for a field ID.
 * Returns the raw field name(s) from the registry.
 */
export function getSalesforceWriteField(fieldId: FieldId): string {
  return FIELD_REGISTRY[fieldId].salesforce.write;
}

/**
 * Get the localStorage key for a field ID.
 * Returns null if the field is not stored in localStorage.
 */
export function getStorageKey(fieldId: FieldId): string | null {
  return FIELD_REGISTRY[fieldId].storageKey;
}

/**
 * Get all field IDs that should be stored in localStorage.
 * Useful for iterating over storable preferences.
 */
export function getStorableFieldIds(): FieldId[] {
  return Object.values(FIELD_REGISTRY)
    .filter((field) => field.storageKey !== null)
    .map((field) => field.id);
}

/**
 * Storage keys for onboarding preferences.
 * Derived from the registry - this is the single source of truth.
 */
export const ONBOARDING_STORAGE_KEYS = Object.fromEntries(
  Object.values(FIELD_REGISTRY)
    .filter((field) => field.storageKey !== null)
    .map((field) => [field.id, field.storageKey])
) as Record<FieldId, string>;

