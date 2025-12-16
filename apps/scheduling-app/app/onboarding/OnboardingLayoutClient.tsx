'use client';

import type { ReactNode } from 'react';
import { OnboardingProvider } from '../providers/_lib/onboarding';

type OnboardingLayoutClientProps = {
  children: ReactNode;
};

export function OnboardingLayoutClient({ children }: OnboardingLayoutClientProps) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

