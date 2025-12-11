'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingProvider, useOnboarding } from '../providers/_lib/onboarding';
import { OnboardingFlow } from '../providers/components/OnboardingFlow';
import type { OnboardingPreferences } from '../providers/_lib/onboarding/types';

type OnboardingPageClientProps = {
  target: string;
  initialPreferences: Partial<OnboardingPreferences>;
};

function OnboardingContent({ target }: { target: string }) {
  const router = useRouter();
  const { isOnboardingComplete, isInitialized } = useOnboarding();

  // Redirect to target when onboarding is complete (for supported states)
  // Note: OnboardingFlow handles redirect to /not-available for unsupported states
  const handleComplete = useCallback(() => {
    router.replace(target);
  }, [target, router]);

  // Auto-redirect if already complete on mount (all values pre-filled)
  useEffect(() => {
    if (isInitialized && isOnboardingComplete) {
      // OnboardingFlow will handle redirect - but if it's already complete 
      // and we're just mounting, trigger redirect manually
      handleComplete();
    }
  }, [isInitialized, isOnboardingComplete, handleComplete]);

  // Show loading state while checking
  if (!isInitialized) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <span className='text-sm text-slate-500'>Loading…</span>
      </div>
    );
  }

  // If already complete, show nothing while redirecting
  if (isOnboardingComplete) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <span className='text-sm text-slate-500'>Redirecting…</span>
      </div>
    );
  }

  return <OnboardingFlow onComplete={handleComplete} />;
}

export function OnboardingPageClient({
  target,
  initialPreferences
}: OnboardingPageClientProps) {
  // Filter out null values from initialPreferences
  const cleanedPreferences = Object.fromEntries(
    Object.entries(initialPreferences).filter(([, v]) => v !== null)
  ) as Partial<OnboardingPreferences>;

  return (
    <OnboardingProvider initialPreferences={cleanedPreferences}>
      <OnboardingContent target={target} />
    </OnboardingProvider>
  );
}

