'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { OnboardingProvider } from './_lib/onboarding';
import { OnboardingSearchParamsConsumer } from './OnboardingSearchParamsConsumer';

type OnboardingProviderWrapperProps = {
  children: ReactNode;
};

export function OnboardingProviderWrapper({
  children
}: OnboardingProviderWrapperProps) {
  return (
    <OnboardingProvider>
      <Suspense fallback={null}>
        <OnboardingSearchParamsConsumer />
      </Suspense>
      {children}
    </OnboardingProvider>
  );
}

