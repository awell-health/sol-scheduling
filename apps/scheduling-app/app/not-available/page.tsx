type NotAvailablePageProps = {
  searchParams?: {
    state?: string;
  };
};

import { StartOverButton } from './StartOverButton';

async function submitNotAvailable(formData: FormData) {
  'use server';
  const phone = formData.get('phone')?.toString() ?? '';
  const state = formData.get('state')?.toString() ?? '';

  // TODO: wire this up to SOL lead capture / notification.
  console.log('Not-available submission received', { phone, state });
}

export default function NotAvailablePage({
  searchParams
}: NotAvailablePageProps) {
  const state = searchParams?.state;

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

        <form
          action={submitNotAvailable}
          className='mt-6 grid gap-4 max-w-md'
        >
          <input type='hidden' name='state' value={state ?? ''} />
          <label className='flex flex-col gap-1 text-left'>
            <span className='text-sm font-medium text-slate-700'>
              Phone number
            </span>
            <input
              type='tel'
              name='phone'
              required
              placeholder='(555) 555-5555'
              className='h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20'
            />
          </label>
          <div className='flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center'>
            <button
              type='submit'
              className='inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 sm:w-auto'
            >
              Submit
            </button>
            <StartOverButton />
          </div>
          <p className='text-xs text-slate-500'>
            Or call us at{' '}
            <a
              href='tel:+18885551234'
              className='font-semibold text-primary underline-offset-2 hover:underline'
            >
              (888) 555-1234
            </a>{' '}
            to talk to our team.
          </p>
        </form>
      </div>
    </main>
  );
}
