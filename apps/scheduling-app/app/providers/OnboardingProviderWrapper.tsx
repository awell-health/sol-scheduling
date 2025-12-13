'use client';

import type { ReactNode } from 'react';
import { OnboardingProvider } from './_lib/onboarding';

type OnboardingProviderWrapperProps = {
  children: ReactNode;
};

export function OnboardingProviderWrapper({
  children
}: OnboardingProviderWrapperProps) {
  return (
    <OnboardingProvider>
      {children}
    </OnboardingProvider>
  );
}

