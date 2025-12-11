'use client';

import { useOnboardingSearchParams } from './_lib/onboarding';

/**
 * Component that consumes search params and writes them to onboarding context.
 * Wrapped in Suspense because it uses useSearchParams.
 */
export function OnboardingSearchParamsConsumer() {
  useOnboardingSearchParams();
  return null;
}

