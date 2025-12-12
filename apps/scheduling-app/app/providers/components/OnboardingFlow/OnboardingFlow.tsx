'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '../../_lib/onboarding/OnboardingContext';
import { OnboardingStep } from '../../_lib/onboarding/types';
import { isSupportedState } from '../../_lib/onboarding/config';
import { StateQuestion } from './StateQuestion';
import { ServiceQuestion } from './ServiceQuestion';
import { PhoneQuestion } from './PhoneQuestion';
import { InsuranceQuestion } from './InsuranceQuestion';

type OnboardingFlowProps = {
  /** Called when all required questions are answered */
  onComplete?: () => void;
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const router = useRouter();
  const {
    preferences,
    setPreferences,
    config,
    currentStepIndex,
    isOnboardingComplete,
    advanceStep,
    goToPreviousStep
  } = useOnboarding();

  // Handlers for each question
  const handleStateChange = useCallback(
    (value: string) => {
      setPreferences({ state: value });
    },
    [setPreferences]
  );

  const handleStateContinue = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

  const handleServiceChange = useCallback(
    (value: string) => {
      setPreferences({ service: value });
    },
    [setPreferences]
  );

  const handleServiceContinue = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

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
    advanceStep();
  }, [advanceStep]);

  const handleInsuranceChange = useCallback(
    (value: string) => {
      setPreferences({ insurance: value });
    },
    [setPreferences]
  );

  const handleInsuranceContinue = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

  // Check for non-supported state when onboarding is complete
  useEffect(() => {
    if (isOnboardingComplete) {
      const { state } = preferences;
      
      // Redirect to /not-available if state is not supported
      if (state && !isSupportedState(state)) {
        router.push(`/not-available?state=${state}`);
        return;
      }

      // Otherwise, notify parent that onboarding is complete
      onComplete?.();
    }
  }, [isOnboardingComplete, preferences, router, onComplete]);

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
            onClick={advanceStep}
            className='text-sm text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline'
          >
            Skip this step
          </button>
        </div>
      )}
    </section>
  );
}
