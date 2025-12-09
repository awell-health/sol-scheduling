/**
 * PostHog feature flag names used for onboarding configuration.
 * Stored as an enum for type safety and single-source-of-truth.
 */
export enum OnboardingFeatureFlags {
  /**
   * Feature flag that controls the onboarding question flow.
   * Payload shape: OnboardingConfig (see types.ts)
   *
   * Example payload:
   * {
   *   "questions": ["state", "service", "phone", "insurance"],
   *   "required": ["state", "service"]
   * }
   */
  ONBOARDING_QUESTIONS_CONFIG = 'onboarding-questions-config'
}

/**
 * Insurance options available in the onboarding flow.
 * Centralized here so both onboarding and booking form use the same list.
 */
export const INSURANCE_OPTIONS = [
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
  { value: 'Self-pay', label: 'Self-pay / No insurance' }
] as const;

/**
 * Service type options for the onboarding flow.
 * Uses the same language as the existing SERVICE_QUESTION_OPTIONS.
 */
export const SERVICE_OPTIONS = [
  {
    value: 'Psychiatric',
    label: 'Medication',
    description:
      'Meet with a medical provider to talk through your situation and evaluate different medication options.'
  },
  {
    value: 'Therapy',
    label: 'Therapy',
    description:
      'Meet with a therapist to talk through your issues and build personal support.'
  },
  {
    value: 'Both',
    label: 'Both',
    description: 'A combination of medication and talk therapy.'
  },
  {
    value: 'Not Sure',
    label: 'Not sure',
    description: 'Help deciding what type of care is right for you.'
  }
] as const;

/**
 * All US states for the state selector.
 */
export const ALL_US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'DC', name: 'Washington DC' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
] as const;

/**
 * States that SOL currently services.
 * Users selecting states not in this list will be redirected to /not-available.
 */
export const SUPPORTED_STATE_CODES = [
  'AZ',
  'CO',
  'CT',
  'FL',
  'IL',
  'MD',
  'NJ',
  'NY',
  'TX',
  'VA'
] as const;

export type SupportedStateCode = (typeof SUPPORTED_STATE_CODES)[number];

export function isSupportedState(code: string): code is SupportedStateCode {
  return SUPPORTED_STATE_CODES.includes(code as SupportedStateCode);
}

