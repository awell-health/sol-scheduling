'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { clearPreferencesStorage, useOnboarding, useBuildUrlWithUtm } from '../../providers/_lib/onboarding';
import { updateLeadAction, getAnyStoredLeadId } from '../../providers/_lib/salesforce';
import { ALL_US_STATES, getBorderingTargetState } from '../../providers/_lib/onboarding/config';

type BorderingPageClientProps = {
  /** The user's original state (e.g., NJ, CT) */
  originalState: string;
};

export function BorderingPageClient({ originalState }: BorderingPageClientProps) {
  const router = useRouter();
  const { setPreferences } = useOnboarding();
  const buildUrlWithUtm = useBuildUrlWithUtm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Look up the target state from the original state
  const targetState = getBorderingTargetState(originalState) ?? 'NY';

  // Get full state names for display
  const originalStateName = ALL_US_STATES.find((s) => s.code === originalState)?.name ?? originalState;
  const targetStateName = ALL_US_STATES.find((s) => s.code === targetState)?.name ?? targetState;

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Update state in context and localStorage to the TARGET state
    setPreferences({ state: targetState });

    // Fire-and-forget: Update Salesforce lead with new state
    const leadResult = getAnyStoredLeadId();
    if (leadResult) {
      // Track if lead was expired
      if (leadResult.wasExpired) {
        // Note: PostHog not available in this component, but expiry is already handled
        console.log('[BorderingPageClient] Lead expired, cleared from storage');
      }
      updateLeadAction({ leadId: leadResult.leadId, state: targetState }).catch((error) => {
        console.error('Failed to update lead state:', error);
      });
    }

    // Navigate to providers page (preserving UTM params)
    router.push(buildUrlWithUtm('/providers'));
  };

  const handleStartOver = () => {
    clearPreferencesStorage();
    router.push(buildUrlWithUtm('/providers'));
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className='text-3xl font-bold text-primary'>
          We can help you in {targetStateName}
        </h1>
      <p className='mb-8 max-w-md text-sm text-slate-600'>
        Although we don&apos;t currently offer services in {originalStateName},
        we can service you in {targetStateName}. Would you like to view our
        providers there?
      </p>
      </div>

      <div className='flex justify-end gap-2'>
        <Button
          type='button'
          onClick={handleStartOver}
          variant='outline'
          size='lg'
        >
          Start over
        </Button>
        <Button
          type='button'
          onClick={handleConfirm}
          disabled={isSubmitting}
          flashOnClick
          size='lg'
        >
          {isSubmitting ? 'Loading…' : 'Yes, show me'}
        </Button>
      </div>
    </>
  );
}

