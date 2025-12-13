'use client';

import type { ReactNode } from 'react';
import { Suspense, useState, useCallback } from 'react';
import { OnboardingProvider } from './_lib/onboarding';
import { SlcParamConsumer } from './SlcParamConsumer';
import type { OnboardingPreferences } from './_lib/onboarding/types';

type OnboardingProviderWrapperProps = {
  children: ReactNode;
};

/**
 * Loading fallback for SlcParamConsumer Suspense boundary.
 * Shows a subtle loading state while checking for slc param.
 */
function SlcLoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    </div>
  );
}

export function OnboardingProviderWrapper({
  children
}: OnboardingProviderWrapperProps) {
  // Track when lead data is loaded so we can re-initialize the provider
  const [leadPreferences, setLeadPreferences] = useState<Partial<OnboardingPreferences> | null>(null);

  const handleLeadLoaded = useCallback((leadId: string, preferences: Partial<OnboardingPreferences>) => {
    console.log('[OnboardingProviderWrapper] Lead loaded:', leadId);
    setLeadPreferences(preferences);
  }, []);

  return (
    <>
      {/* Check for slc param and fetch lead data before rendering provider */}
      <Suspense fallback={<SlcLoadingFallback />}>
        <SlcParamConsumer onLeadLoaded={handleLeadLoaded} />
      </Suspense>
      
      {/* Key the provider on leadPreferences to force re-initialization when lead is loaded */}
      <OnboardingProvider key={leadPreferences ? 'with-lead' : 'no-lead'}>
        {children}
      </OnboardingProvider>
    </>
  );
}

