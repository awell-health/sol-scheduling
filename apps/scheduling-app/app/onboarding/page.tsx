import { OnboardingPageClient } from './OnboardingPageClient';

type OnboardingPageProps = {
  searchParams: Promise<{
    target?: string;
    state?: string;
    service?: string;
    phone?: string;
    insurance?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  
  // Extract target URL (default to /providers)
  const target = params.target || '/providers';
  
  // Extract initial preferences from URL params
  const initialPreferences = {
    state: params.state || null,
    service: params.service || null,
    phone: params.phone || null,
    insurance: params.insurance || null,
  };

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <OnboardingPageClient
          target={target}
          initialPreferences={initialPreferences}
        />
      </div>
    </main>
  );
}

