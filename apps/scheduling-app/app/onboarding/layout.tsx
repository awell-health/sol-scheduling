import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { OnboardingLayoutClient } from './OnboardingLayoutClient';

export const metadata: Metadata = {
  title: 'Get Started | SOL Mental Health',
  description:
    'Answer a few quick questions to find the right mental health provider for you.'
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8'>
          <p className='text-sm font-semibold uppercase tracking-wide text-secondary-foreground'>
            SOL Mental Health
          </p>
        </div>
      </header>
      <OnboardingLayoutClient>{children}</OnboardingLayoutClient>
    </>
  );
}

