'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useOnboarding } from './OnboardingContext';
import { OnboardingStep, type OnboardingPreferences } from './types';

/**
 * Hook to consume onboarding-related search params from the URL,
 * write them to the context, and then clean the URL (keeping returnUrl).
 *
 * Supported params: state, service, phone, insurance, returnUrl
 */
export function useOnboardingSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setPreferences, setReturnUrl, isInitialized } = useOnboarding();
  const hasConsumed = useRef(false);

  useEffect(() => {
    // Only run once after context is initialized
    if (!isInitialized || hasConsumed.current) return;

    const state = searchParams.get('state');
    const service = searchParams.get('service');
    const phone = searchParams.get('phone');
    const insurance = searchParams.get('insurance');
    const returnUrlParam = searchParams.get('returnUrl');

    const updates: Partial<OnboardingPreferences> = {};
    let hasUpdates = false;

    if (state) {
      updates.state = state;
      hasUpdates = true;
    }
    if (service) {
      updates.service = service;
      hasUpdates = true;
    }
    if (phone) {
      updates.phone = phone;
      hasUpdates = true;
    }
    if (insurance) {
      updates.insurance = insurance;
      hasUpdates = true;
    }

    if (hasUpdates) {
      setPreferences(updates);
    }

    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }

    // Build clean URL (only keep returnUrl if present)
    const paramsToStrip = ['state', 'service', 'phone', 'insurance'];
    const hasParamsToStrip = paramsToStrip.some((p) => searchParams.has(p));

    if (hasParamsToStrip) {
      const newParams = new URLSearchParams();
      if (returnUrlParam) {
        newParams.set('returnUrl', returnUrlParam);
      }
      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;

      // Replace URL without triggering navigation/re-render
      router.replace(newUrl, { scroll: false });
    }

    hasConsumed.current = true;
  }, [
    searchParams,
    setPreferences,
    setReturnUrl,
    router,
    pathname,
    isInitialized
  ]);
}

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

