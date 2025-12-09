/**
 * Onboarding preferences collected during the intake flow.
 */
export type OnboardingPreferences = {
  /** US state code (e.g., "NY", "CA") */
  state: string | null;
  /** Service type / modality */
  service: string | null;
  /** US phone number (digits only or formatted) */
  phone: string | null;
  /** Insurance carrier value */
  insurance: string | null;
};

/**
 * Question step identifiers.
 */
export enum OnboardingStep {
  STATE = 'state',
  SERVICE = 'service',
  PHONE = 'phone',
  INSURANCE = 'insurance'
}

/**
 * Feature flag payload shape for configuring onboarding.
 */
export type OnboardingConfig = {
  /**
   * Ordered list of questions to show.
   * Questions not in this list are skipped.
   */
  questions: OnboardingStep[];
  /**
   * Questions that must be answered before showing providers.
   * If a question is required but not in `questions`, it's ignored.
   */
  required: OnboardingStep[];
};

/**
 * Default configuration when no feature flag is set.
 */
export const DEFAULT_ONBOARDING_CONFIG: OnboardingConfig = {
  questions: [
    OnboardingStep.STATE,
    OnboardingStep.SERVICE,
    OnboardingStep.PHONE,
    OnboardingStep.INSURANCE
  ],
  required: [OnboardingStep.STATE, OnboardingStep.SERVICE, OnboardingStep.PHONE, OnboardingStep.INSURANCE]
};

