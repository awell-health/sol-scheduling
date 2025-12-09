import type { ReactNode } from 'react';
import { SchedulingHeader } from '../../components/layout/SchedulingHeader';
import { OnboardingProviderWrapper } from './OnboardingProviderWrapper';

export default function ProvidersLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SchedulingHeader />
      <OnboardingProviderWrapper>{children}</OnboardingProviderWrapper>
    </>
  );
}
