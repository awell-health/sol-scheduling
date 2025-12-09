import type { Metadata } from 'next';
import { NotAvailableForm } from './NotAvailableForm';

type NotAvailablePageProps = {
  searchParams: Promise<{
    state?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Not yet available in your area | SOL Mental Health',
  description:
    "SOL Mental Health is not yet available in your area. Leave your details and we'll reach out when services launch near you."
};

export default async function NotAvailablePage({
  searchParams
}: NotAvailablePageProps) {
  const { state } = await searchParams;

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center'>
        <header className='mb-8 space-y-1'>
          <p className='text-sm font-semibold uppercase tracking-wide text-secondary-foreground'>
            SOL Mental Health
          </p>
          <h1 className='text-3xl font-bold text-primary'>
            We&apos;re not available in your area yet
          </h1>
          {state && (
            <p className='mt-1 text-sm font-medium uppercase tracking-wide text-slate-500'>
              Selected state: {state}
            </p>
          )}
        </header>

        <p className='max-w-md text-sm text-slate-600'>
          SOL Mental Health isn&apos;t currently offering services in this state.
          Please check back soon, or share your details below and we&apos;ll reach
          out when we&apos;re available in your area.
        </p>

        <NotAvailableForm state={state ?? null} />
      </div>
    </main>
  );
}
