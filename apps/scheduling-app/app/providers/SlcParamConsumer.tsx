'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getLeadAction, storeLeadFromSalesforce } from './_lib/salesforce';
import { writePreferencesToStorage } from './_lib/onboarding';
import type { OnboardingPreferences } from './_lib/onboarding/types';

type SlcParamConsumerProps = {
  /** Callback when lead data is loaded and preferences are populated */
  onLeadLoaded?: (leadId: string, preferences: Partial<OnboardingPreferences>) => void;
};

/**
 * Component that consumes the `slc` (Salesforce Lead Code) search param.
 * When present:
 * 1. Fetches the lead from Salesforce
 * 2. Stores the lead ID in _slc localStorage
 * 3. Populates sol.onboarding localStorage with lead fields
 * 4. Removes slc from URL (keeps other params like returnUrl, target)
 *
 * Must be wrapped in Suspense because it uses useSearchParams.
 */
export function SlcParamConsumer({ onLeadLoaded }: SlcParamConsumerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasConsumed = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run once
    if (hasConsumed.current) return;

    const slc = searchParams.get('slc');
    if (!slc) {
      hasConsumed.current = true;
      return;
    }

    hasConsumed.current = true;

    async function fetchAndStoreLead(leadId: string) {
      setIsLoading(true);
      setError(null);

      try {
        console.log('[SlcParamConsumer] Fetching lead:', leadId);
        const result = await getLeadAction(leadId);

        if (!result.success || !result.lead) {
          console.error('[SlcParamConsumer] Failed to fetch lead:', result.error);
          setError(result.error ?? 'Failed to fetch lead');
          setIsLoading(false);
          return;
        }

        const lead = result.lead;

        // Store lead data in _slc localStorage
        storeLeadFromSalesforce(lead);
        console.log('[SlcParamConsumer] Stored lead in _slc');

        // Build onboarding preferences from lead data
        const preferences: Partial<OnboardingPreferences> = {};

        if (lead.phone) {
          preferences.phone = lead.phone;
        }
        if (lead.state) {
          preferences.state = lead.state;
        }
        if (lead.insurance) {
          preferences.insurance = lead.insurance;
        }
        if (lead.service) {
          preferences.service = lead.service;
        }
        if (lead.consent !== null) {
          preferences.consent = lead.consent;
        }

        // Write to sol.onboarding localStorage
        if (Object.keys(preferences).length > 0) {
          writePreferencesToStorage(preferences);
          console.log('[SlcParamConsumer] Wrote preferences to sol.onboarding:', preferences);
        }

        // Notify parent
        onLeadLoaded?.(leadId, preferences);

        // Clean URL - remove slc param but keep others (returnUrl, target, etc.)
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('slc');
        const newUrl = newParams.toString()
          ? `${pathname}?${newParams.toString()}`
          : pathname;

        router.replace(newUrl, { scroll: false });
      } catch (err) {
        console.error('[SlcParamConsumer] Error fetching lead:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAndStoreLead(slc);
  }, [searchParams, router, pathname, onLeadLoaded]);

  // Show loading indicator while fetching
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-slate-600">Loading your information…</p>
        </div>
      </div>
    );
  }

  // Show error if fetch failed
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="mx-4 max-w-md rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-800">
            We couldn't load your information. Please continue with the form below.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

