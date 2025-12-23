'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useOnboarding } from '../../_lib/onboarding/OnboardingContext';
import { useBuildUrlWithUtm } from '../../_lib/onboarding';
import { OnboardingStep } from '../../_lib/onboarding/types';
import { isSupportedState, getBorderingTargetState } from '../../_lib/onboarding/config';
import { StateQuestion } from './StateQuestion';
import { ServiceQuestion } from './ServiceQuestion';
import { PhoneQuestion } from './PhoneQuestion';
import { InsuranceQuestion } from './InsuranceQuestion';

export type OnboardingEntryPoint = 'provider_list' | 'provider_detail' | 'unknown';

type OnboardingFlowProps = {
  /** Called when all required questions are answered */
  onComplete?: () => void;
  /** Entry point type for analytics tracking */
  entryPoint?: OnboardingEntryPoint;
};

export function OnboardingFlow({ onComplete, entryPoint = 'unknown' }: OnboardingFlowProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const hasTrackedStartRef = useRef(false);
  const {
    preferences,
    setPreferences,
    config,
    currentStepIndex,
    isOnboardingComplete,
    advanceStep,
    goToPreviousStep
  } = useOnboarding();
  const buildUrlWithUtm = useBuildUrlWithUtm();

  // Track onboarding started (only once per session)
  useEffect(() => {
    if (!hasTrackedStartRef.current && currentStepIndex !== null) {
      hasTrackedStartRef.current = true;
      posthog?.capture('onboarding_started', {
        total_steps: config.questions.length,
        entry_point: entryPoint,
      });
    }
  }, [currentStepIndex, config.questions.length, posthog, entryPoint]);

  // Helper to track step completion
  const trackStepCompleted = useCallback(
    (step: OnboardingStep, skipped = false) => {
      const stepIndex = config.questions.indexOf(step);
      const isLastStep = stepIndex === config.questions.length - 1;
      
      posthog?.capture('onboarding_step_completed', {
        step,
        step_number: stepIndex + 1,
        total_steps: config.questions.length,
        skipped,
      });
      
      // If this is the last step, also track onboarding completed
      if (isLastStep) {
        posthog?.capture('onboarding_completed', {
          total_steps: config.questions.length,
          entry_point: entryPoint,
        });
      }
    },
    [config.questions, posthog, entryPoint]
  );

  // Handlers for each question
  const handleStateChange = useCallback(
    (value: string) => {
      setPreferences({ state: value });
    },
    [setPreferences]
  );

  const handleStateContinue = useCallback(() => {
    trackStepCompleted(OnboardingStep.STATE);
    advanceStep();
  }, [advanceStep, trackStepCompleted]);

  const handleServiceChange = useCallback(
    (value: string) => {
      setPreferences({ service: value });
    },
    [setPreferences]
  );

  const handleServiceContinue = useCallback(() => {
    trackStepCompleted(OnboardingStep.SERVICE);
    advanceStep();
  }, [advanceStep, trackStepCompleted]);

  const handlePhoneChange = useCallback(
    (value: string) => {
      setPreferences({ phone: value });
    },
    [setPreferences]
  );

  const handleConsentChange = useCallback(
    (value: boolean) => {
      setPreferences({ consent: value });
    },
    [setPreferences]
  );

  const handlePhoneContinue = useCallback(() => {
    trackStepCompleted(OnboardingStep.PHONE);
    advanceStep();
  }, [advanceStep, trackStepCompleted]);

  const handleInsuranceChange = useCallback(
    (value: string) => {
      setPreferences({ insurance: value });
    },
    [setPreferences]
  );

  const handleInsuranceContinue = useCallback(() => {
    trackStepCompleted(OnboardingStep.INSURANCE);
    advanceStep();
  }, [advanceStep, trackStepCompleted]);

  // Check for non-supported state when onboarding is complete
  useEffect(() => {
    if (isOnboardingComplete) {
      const { state } = preferences;
      
      // Check if state is not supported
      if (state && !isSupportedState(state)) {
        // Check if it's a bordering state that can be redirected
        const borderTarget = getBorderingTargetState(state);
        if (borderTarget) {
          const url = buildUrlWithUtm('/onboarding/bordering', { state });
          router.push(url);
        } else {
          const url = buildUrlWithUtm('/not-available', { state });
          router.push(url);
        }
        return;
      }

      // Otherwise, notify parent that onboarding is complete
      onComplete?.();
    }
  }, [isOnboardingComplete, preferences, router, onComplete, buildUrlWithUtm]);

  // If onboarding is complete, don't render anything
  if (currentStepIndex === null || isOnboardingComplete) {
    return null;
  }

  const currentStep = config.questions[currentStepIndex];
  const stepNumber = currentStepIndex + 1;
  const totalSteps = config.questions.length;
  const canGoBack = currentStepIndex > 0;

  // Progress indicator
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <section className='flex flex-col'>
      {/* Progress bar */}
      <div className='mb-8'>
        <div className='mb-2 flex items-center justify-between text-xs text-slate-500'>
          <span>
            Step {stepNumber} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-200'>
          <div
            className='h-full rounded-full bg-primary transition-all duration-500'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Back button */}
      {canGoBack && (
        <div className='mb-4'>
          <button
            type='button'
            onClick={goToPreviousStep}
            className='inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Question content */}
      <div className='flex flex-1 items-center justify-center'>
        {currentStep === OnboardingStep.STATE && (
          <StateQuestion
            value={preferences.state}
            onChange={handleStateChange}
            onContinue={handleStateContinue}
          />
        )}

        {currentStep === OnboardingStep.SERVICE && (
          <ServiceQuestion
            value={preferences.service}
            onChange={handleServiceChange}
            onContinue={handleServiceContinue}
          />
        )}

        {currentStep === OnboardingStep.PHONE && (
          <PhoneQuestion
            value={preferences.phone}
            onChange={handlePhoneChange}
            onContinue={handlePhoneContinue}
            state={preferences.state}
            service={preferences.service}
            consent={preferences.consent}
            onConsentChange={handleConsentChange}
          />
        )}

        {currentStep === OnboardingStep.INSURANCE && (
          <InsuranceQuestion
            value={preferences.insurance}
            onChange={handleInsuranceChange}
            onContinue={handleInsuranceContinue}
          />
        )}
      </div>

      {/* Skip link for non-required questions */}
      {!config.required.includes(currentStep) && (
        <div className='mt-6 text-center'>
          <button
            type='button'
            onClick={() => {
              trackStepCompleted(currentStep, true);
              advanceStep();
            }}
            className='text-sm text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline'
          >
            Skip this step
          </button>
        </div>
      )}
    </section>
  );
}
