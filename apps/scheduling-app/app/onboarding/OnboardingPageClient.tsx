'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding, useBuildUrlWithUtm } from '../providers/_lib/onboarding';
import { OnboardingFlow, type OnboardingEntryPoint } from '../providers/components/OnboardingFlow';

type OnboardingPageClientProps = {
  target: string;
};

/**
 * Derive entry point type from target URL for analytics.
 * - "provider_list" for /providers
 * - "provider_detail" for /providers/{id}
 */
function getEntryPoint(target: string): OnboardingEntryPoint {
  // Match /providers/{id} pattern (with optional query params)
  if (/^\/providers\/[^/?]+/.test(target)) return 'provider_detail';
  // Match /providers (with or without trailing slash/query)
  if (/^\/providers\/?(\?|$)/.test(target)) return 'provider_list';
  return 'unknown';
}

export function OnboardingPageClient({ target }: OnboardingPageClientProps) {
  const router = useRouter();
  const { isOnboardingComplete, isInitialized } = useOnboarding();
  const buildUrlWithUtm = useBuildUrlWithUtm();
  
  const entryPoint = useMemo(() => getEntryPoint(target), [target]);

  // Redirect to target when onboarding is complete (for supported states)
  // Note: OnboardingFlow handles redirect to /not-available for unsupported states
  const handleComplete = useCallback(() => {
    // Preserve UTM params when redirecting to target
    const url = buildUrlWithUtm(target);
    router.replace(url);
  }, [target, router, buildUrlWithUtm]);

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

  return <OnboardingFlow onComplete={handleComplete} entryPoint={entryPoint} />;
}

