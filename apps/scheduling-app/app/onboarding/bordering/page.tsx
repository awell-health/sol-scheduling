import type { Metadata } from 'next';
import { BorderingPageClient } from './BorderingPageClient';
import { redirect } from 'next/navigation';

type BorderingPageProps = {
  searchParams: Promise<{
    state?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Services available nearby | SOL Mental Health',
  description:
    'SOL Mental Health provides services in a nearby state. View our providers there.'
};

export default async function BorderingPage({
  searchParams
}: BorderingPageProps) {
  const { state } = await searchParams;

  if (!state) {
    redirect('/not-available');
  }

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center'>
        <BorderingPageClient originalState={state} />
      </div>
    </main>
  );
}

