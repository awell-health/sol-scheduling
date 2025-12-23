import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProvidersPage } from './ProvidersPage';

export const metadata: Metadata = {
  title: 'Find a provider | SOL Mental Health',
  description:
    'Browse licensed SOL providers and pick the appointment that works best for you with SOL Mental Health.'
};

export default function ProvidersRoute() {
  return (
    <main className='min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <Suspense fallback={<div className='text-sm text-slate-500'>Loading...</div>}>
          <ProvidersPage />
        </Suspense>
      </div>
    </main>
  );
}
