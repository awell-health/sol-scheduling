'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  useOnboarding,
  useBuildUrlWithReturn,
  useBuildUrlWithUtm,
  isSupportedState,
  getBorderingTargetState,
} from './_lib/onboarding';
import { ProviderFilters } from './components/ProviderFilters';
import { ProviderCard } from './components/ProviderCard';
import { ProvidersEmptyState } from './components/ProvidersEmptyState';
import { useProviders } from './hooks';

export function ProvidersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    preferences,
    isOnboardingComplete,
    isInitialized,
    returnUrl,
  } = useOnboarding();
  const buildUrlWithReturn = useBuildUrlWithReturn();
  const buildUrlWithUtm = useBuildUrlWithUtm();

  // Provider search state and data fetching
  const {
    pendingFilters,
    setPendingFilters,
    providers,
    loading,
    error,
    handleFiltersSubmit,
    handleResetFilters,
    handleRetry,
    listHeading,
    filterMessage,
    missingRequiredFilters,
  } = useProviders({
    preferences,
    isInitialized,
    isOnboardingComplete,
  });

  // Redirect to onboarding if not complete
  useEffect(() => {
    if (isInitialized && !isOnboardingComplete) {
      const url = buildUrlWithUtm('/onboarding', { target: pathname });
      router.replace(url);
    }
  }, [isInitialized, isOnboardingComplete, pathname, router, buildUrlWithUtm]);

  // Redirect to /not-available or /onboarding/bordering if state is not supported
  useEffect(() => {
    if (isInitialized && isOnboardingComplete && preferences.state) {
      if (!isSupportedState(preferences.state)) {
        const borderTarget = getBorderingTargetState(preferences.state);
        if (borderTarget) {
          const url = buildUrlWithUtm('/onboarding/bordering', {
            state: preferences.state,
          });
          router.replace(url);
        } else {
          const url = buildUrlWithUtm('/not-available', {
            state: preferences.state,
          });
          router.replace(url);
        }
      }
    }
  }, [isInitialized, isOnboardingComplete, preferences.state, router, buildUrlWithUtm]);

  // Navigation handler
  const handleSelectProvider = (providerId: string) => {
    const url = buildUrlWithReturn(`/providers/${providerId}`);
    router.push(url);
  };

  // Determine if we're redirecting
  const isRedirecting =
    !isInitialized ||
    !isOnboardingComplete ||
    (preferences.state && !isSupportedState(preferences.state));

  if (isRedirecting) {
    return (
      <div className='flex flex-col gap-2'>
        <header className='space-y-1'>
          <h1 className='text-2xl font-bold text-primary md:text-3xl'>
            Find a provider
          </h1>
          <p className='max-w-2xl text-sm text-slate-600'>
            Browse licensed SOL providers and pick the appointment that works
            best for you.
          </p>
        </header>
        <div className='mt-8 flex items-center justify-center'>
          <span className='text-sm text-slate-500'>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <header className='mb-2 space-y-1'>
        <h1 className='text-2xl font-bold text-primary md:text-3xl'>
          Find a provider
        </h1>
        <p className='max-w-2xl text-sm text-slate-600'>
          Browse licensed SOL providers and pick the appointment that works best
          for you.
        </p>
      </header>

      {isOnboardingComplete && (
        <>
          <ProviderFilters
            values={pendingFilters}
            onChange={setPendingFilters}
            onSubmit={handleFiltersSubmit}
            isSubmitting={loading}
          />

          {error && (
            <div className='mt-2 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 md:flex-row md:items-center md:justify-between'>
              <p className='md:max-w-xl'>
                We&apos;re sorry, but something isn&apos;t working right 😅.
                Please try again in a moment.
              </p>
              <button
                type='button'
                onClick={handleRetry}
                className='inline-flex h-9 items-center justify-center rounded-md bg-amber-700 px-4 text-xs font-semibold text-amber-50 shadow-sm transition hover:bg-amber-800'
              >
                Try again
              </button>
            </div>
          )}

          {missingRequiredFilters.length > 0 && (
            <div className='mt-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
              <p>
                Please select{' '}
                {missingRequiredFilters.length === 1
                  ? missingRequiredFilters[0]
                  : missingRequiredFilters.length === 2
                    ? `${missingRequiredFilters[0]} and ${missingRequiredFilters[1]}`
                    : `${missingRequiredFilters.slice(0, -1).join(', ')}, and ${missingRequiredFilters[missingRequiredFilters.length - 1]}`}{' '}
                to search for providers.
              </p>
            </div>
          )}

          {!error && (
            <section className='space-y-4 pb-16 md:pb-0'>
              {filterMessage && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    filterMessage.variant === 'warning'
                      ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : filterMessage.variant === 'success'
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-sky-200 bg-sky-50 text-sky-800'
                  }`}
                >
                  {filterMessage.message}
                </div>
              )}
              <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold text-primary'>
                  {listHeading}
                </h2>
              </div>

              {loading ? (
                <div className='flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16'>
                  <span className='text-sm text-slate-500'>Loading…</span>
                </div>
              ) : providers.length === 0 ? (
                <ProvidersEmptyState onReset={handleResetFilters} />
              ) : (
                <div className='flex flex-col gap-4'>
                  {providers.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onSelect={handleSelectProvider}
                      returnUrl={returnUrl ?? undefined}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
