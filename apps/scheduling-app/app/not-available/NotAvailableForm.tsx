'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { readPreferencesFromStorage, clearPreferencesStorage, useBuildUrlWithUtm } from '../providers/_lib/onboarding';
import { PhoneInput, type E164Number } from '../../components/ui/phone-input';

type NotAvailableFormProps = {
  state: string | null;
};

export function NotAvailableForm({ state }: NotAvailableFormProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const buildUrlWithUtm = useBuildUrlWithUtm();
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill phone from onboarding preferences
  useEffect(() => {
    const prefs = readPreferencesFromStorage();
    if (prefs.phone) {
      setPhone(prefs.phone as E164Number);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Capture waitlist intent in PostHog
    posthog?.capture('waitlist_signup', {
      state,
      has_phone: Boolean(phone),
    });

    setIsSubmitted(true);
  };

  const handleStartOver = () => {
    clearPreferencesStorage();
    router.push(buildUrlWithUtm('/providers'));
  };

  if (isSubmitted) {
    return (
      <div className='mt-6 max-w-md rounded-lg border border-green-200 bg-green-50 p-4'>
        <p className='text-sm font-medium text-green-800'>
          Thanks! We&apos;ll reach out when services are available in your area.
        </p>
        <button
          type='button'
          onClick={handleStartOver}
          className='mt-3 text-sm font-semibold text-primary underline-offset-2 hover:underline'
        >
          Start over with a different state
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='mt-6 grid max-w-md gap-4'>
      <input type='hidden' name='state' value={state ?? ''} />
      <label className='flex flex-col gap-1 text-left'>
        <span className='text-sm font-medium text-slate-700'>Phone number</span>
        <PhoneInput
          value={phone}
          onChange={(value) => setPhone(value)}
          className='h-11'
          placeholder='(555) 555-5555'
          required
        />
      </label>
      <div className='flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center'>
        <button
          type='submit'
          className='inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 sm:w-auto'
        >
          Notify me
        </button>
        <button
          type='button'
          onClick={handleStartOver}
          className='inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto'
        >
          Start over
        </button>
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
  );
}
