'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useOnboarding } from './OnboardingContext';
import { OnboardingStep, type OnboardingPreferences } from './types';

/**
 * Lifecycle hook for onboarding events.
 * Placeholder for future Salesforce lead creation/update calls.
 *
 * @param callbacks - Optional callbacks for lifecycle events
 */
export function useOnboardingLifecycle(callbacks?: {
  onStepComplete?: (step: OnboardingStep, value: string) => void | Promise<void>;
  onOnboardingComplete?: (preferences: OnboardingPreferences) => void | Promise<void>;
}) {
  const { preferences, isOnboardingComplete, currentStepIndex, config } =
    useOnboarding();
  const prevStepRef = useRef<number | null>(null);
  const wasCompleteRef = useRef(false);

  useEffect(() => {
    // Detect step advancement
    if (
      prevStepRef.current !== null &&
      currentStepIndex !== null &&
      currentStepIndex > prevStepRef.current
    ) {
      const completedStep = config.questions[prevStepRef.current];
      const value = preferences[completedStep];
      if (completedStep && value && callbacks?.onStepComplete) {
        callbacks.onStepComplete(completedStep, value);
      }
    }

    // Detect onboarding completion
    if (isOnboardingComplete && !wasCompleteRef.current) {
      callbacks?.onOnboardingComplete?.(preferences);
    }

    prevStepRef.current = currentStepIndex;
    wasCompleteRef.current = isOnboardingComplete;
  }, [
    currentStepIndex,
    isOnboardingComplete,
    preferences,
    config.questions,
    callbacks
  ]);
}

/**
 * Build a URL that preserves the returnUrl from context.
 */
export function useBuildUrlWithReturn() {
  const { returnUrl } = useOnboarding();

  return useCallback(
    (basePath: string, additionalParams?: Record<string, string>) => {
      const params = new URLSearchParams(additionalParams);
      if (returnUrl) {
        params.set('returnUrl', returnUrl);
      }
      const queryString = params.toString();
      return queryString ? `${basePath}?${queryString}` : basePath;
    },
    [returnUrl]
  );
}

