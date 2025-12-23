import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProviderDetailPage } from './ProviderDetailPage';

export const metadata: Metadata = {
  title: 'Provider details | SOL Mental Health',
  description:
    'View provider details and schedule an appointment with a SOL Mental Health provider.'
};

type ProviderDetailRouteProps = {
  params: Promise<{ providerId: string }>;
};

export default async function ProviderDetailRoute({
  params
}: ProviderDetailRouteProps) {
  const { providerId } = await params;
  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <Suspense fallback={<div className='text-sm text-slate-500'>Loading...</div>}>
          <ProviderDetailPage providerId={providerId} />
        </Suspense>
      </div>
    </main>
  );
}
