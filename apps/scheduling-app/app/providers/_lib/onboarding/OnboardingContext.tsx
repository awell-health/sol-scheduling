'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import {
  DEFAULT_ONBOARDING_CONFIG,
  OnboardingStep,
  type OnboardingConfig,
  type OnboardingPreferences
} from './types';
import {
  readPreferencesFromStorage,
  writePreferencesToStorage,
  clearPreferencesStorage
} from './storage';

type OnboardingContextValue = {
  /** Current preferences */
  preferences: OnboardingPreferences;
  /** Update one or more preferences (merges with existing) */
  setPreferences: (update: Partial<OnboardingPreferences>) => void;
  /** Clear all preferences */
  clearPreferences: () => void;
  /** Feature-flag-driven config */
  config: OnboardingConfig;
  /** Whether required questions have been answered */
  isOnboardingComplete: boolean;
  /** The current step index in the onboarding flow (null if complete) */
  currentStepIndex: number | null;
  /** Advance to the next step */
  advanceStep: () => void;
  /** Go back to the previous step */
  goToPreviousStep: () => void;
  /** Navigate to a specific step */
  goToStep: (index: number) => void;
  /** Return URL to redirect after booking */
  returnUrl: string | null;
  /** Set the return URL */
  setReturnUrl: (url: string | null) => void;
  /** Whether context has been initialized from storage */
  isInitialized: boolean;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

type OnboardingProviderProps = {
  children: ReactNode;
  /** Optional initial return URL (from server-side searchParams) */
  initialReturnUrl?: string;
};

export function OnboardingProvider({
  children,
  initialReturnUrl
}: OnboardingProviderProps) {
  const [preferences, setPreferencesState] = useState<OnboardingPreferences>({
    state: null,
    service: null,
    phone: null,
    insurance: null,
    consent: null
  });
  const [returnUrl, setReturnUrl] = useState<string | null>(
    initialReturnUrl ?? null
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(0);

  // Always use the default config (all questions mandatory)
  const config = useMemo<OnboardingConfig>(() => {
    return DEFAULT_ONBOARDING_CONFIG;
  }, []);

  // Helper to check if a preference value is valid
  const isPreferenceValid = useCallback((step: OnboardingStep, value: string | null): boolean => {
    if (value === null || value === '') return false;
    if (step === OnboardingStep.PHONE) {
      // E.164 format: +1XXXXXXXXXX (12 chars) or digits only: 10 or 11 digits
      const phoneDigits = value.replace(/\D/g, '');
      return phoneDigits.length === 10 || phoneDigits.length === 11;
    }
    return true;
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = readPreferencesFromStorage();
    
    setPreferencesState(stored);
    
    // Check if all required questions are already answered
    // If so, mark onboarding as complete by setting currentStepIndex to null
    const allRequiredAnswered = config.required.every((step) => 
      isPreferenceValid(step, stored[step])
    );
    
    if (allRequiredAnswered) {
      // All required answered - skip to completion
      setCurrentStepIndex(null);
    } else {
      // Find the first unanswered required question
      const firstUnansweredIndex = config.questions.findIndex((step) => 
        config.required.includes(step) && !isPreferenceValid(step, stored[step])
      );
      setCurrentStepIndex(firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0);
    }
    
    setIsInitialized(true);
  }, []);

  const setPreferences = useCallback(
    (update: Partial<OnboardingPreferences>) => {
      setPreferencesState((prev) => {
        const next = { ...prev, ...update };
        writePreferencesToStorage(update);
        return next;
      });
    },
    []
  );

  const clearPreferences = useCallback(() => {
    clearPreferencesStorage();
    setPreferencesState({
      state: null,
      service: null,
      phone: null,
      insurance: null,
      consent: null
    });
    setCurrentStepIndex(0);
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev === null) return null;
      const next = prev + 1;
      return next >= config.questions.length ? null : next;
    });
  }, [config.questions.length]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev === null || prev === 0) return 0;
      return prev - 1;
    });
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= config.questions.length) return;
    setCurrentStepIndex(index);
  }, [config.questions.length]);

  // Check if onboarding is complete
  // Only true when currentStepIndex is null (user clicked Continue on last step OR loaded with all data)
  const isOnboardingComplete = useMemo(() => {
    if (currentStepIndex !== null) {
      return false;
    }
    // Verify all required fields are still valid
    return config.required.every((step) => isPreferenceValid(step, preferences[step]));
  }, [preferences, config.required, currentStepIndex, isPreferenceValid]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      preferences,
      setPreferences,
      clearPreferences,
      config,
      isOnboardingComplete,
      currentStepIndex,
      advanceStep,
      goToPreviousStep,
      goToStep,
      returnUrl,
      setReturnUrl,
      isInitialized
    }),
    [
      preferences,
      setPreferences,
      clearPreferences,
      config,
      isOnboardingComplete,
      currentStepIndex,
      advanceStep,
      goToPreviousStep,
      goToStep,
      returnUrl,
      isInitialized
    ]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

