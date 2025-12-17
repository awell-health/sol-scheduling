import { Suspense } from 'react';
import { OnboardingPageClient } from './OnboardingPageClient';

type OnboardingPageProps = {
  searchParams: Promise<{
    target?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  
  // Extract target URL (default to /providers)
  const target = params.target || '/providers';

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <Suspense fallback={<div className='text-sm text-slate-500'>Loading...</div>}>
          <OnboardingPageClient target={target} />
        </Suspense>
      </div>
    </main>
  );
}

