// Types
export {
  OnboardingStep,
  DEFAULT_ONBOARDING_CONFIG,
  type OnboardingPreferences,
  type OnboardingConfig
} from './types';

// Config
export {
  INSURANCE_OPTIONS,
  SERVICE_OPTIONS,
  ALL_US_STATES,
  SUPPORTED_STATE_CODES,
  isSupportedState,
  BORDERING_STATE_MAP,
  getBorderingTargetState,
  type SupportedStateCode
} from './config';

// Storage
export {
  STORAGE_KEYS,
  readPreferencesFromStorage,
  writePreferencesToStorage,
  clearPreferencesStorage,
  getStoredPhone
} from './storage';

// Context & Hooks
export { OnboardingProvider, useOnboarding } from './OnboardingContext';
export {
  useOnboardingLifecycle,
  useBuildUrlWithReturn
} from './hooks';

// UTM Tracking
export {
  UtmParam,
  UTM_PARAM_KEYS,
  UtmPersonProperty,
  type UtmParams,
  extractUtmParams,
  hasUtmParams,
  buildUrlWithUtm,
  readUtmFromStorage,
  writeUtmToStorage,
  useUtmCapture,
  useBuildUrlWithUtm,
} from '../utm';

