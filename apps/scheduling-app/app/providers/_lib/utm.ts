'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Standard UTM parameter keys.
 * Using an enum for consistent naming as per project conventions.
 */
export enum UtmParam {
  UTM_SOURCE = 'utm_source',
  UTM_MEDIUM = 'utm_medium',
  UTM_CAMPAIGN = 'utm_campaign',
  UTM_TERM = 'utm_term',
  UTM_CONTENT = 'utm_content',
}

/** All UTM parameter keys as an array for iteration */
export const UTM_PARAM_KEYS = Object.values(UtmParam);

/**
 * PostHog automatically sets these person properties when UTM params are in the URL.
 * See: https://posthog.com/docs/data/utm-segmentation
 * 
 * Note: PostHog uses $ prefix (e.g., $initial_utm_source) for its auto-captured properties.
 * These are provided for reference when filtering/analyzing in PostHog.
 */
export enum UtmPersonProperty {
  INITIAL_UTM_SOURCE = '$initial_utm_source',
  INITIAL_UTM_MEDIUM = '$initial_utm_medium',
  INITIAL_UTM_CAMPAIGN = '$initial_utm_campaign',
  INITIAL_UTM_TERM = '$initial_utm_term',
  INITIAL_UTM_CONTENT = '$initial_utm_content',
  // Latest values (updated on each visit with UTMs)
  LATEST_UTM_SOURCE = '$latest_utm_source',
  LATEST_UTM_MEDIUM = '$latest_utm_medium',
  LATEST_UTM_CAMPAIGN = '$latest_utm_campaign',
  LATEST_UTM_TERM = '$latest_utm_term',
  LATEST_UTM_CONTENT = '$latest_utm_content',
}

/** Type for UTM parameters record */
export type UtmParams = Partial<Record<UtmParam, string>>;

const UTM_STORAGE_KEY = 'sol.utm';

/**
 * Extract UTM parameters from URLSearchParams.
 */
export function extractUtmParams(searchParams: URLSearchParams): UtmParams {
  const utmParams: UtmParams = {};

  for (const key of UTM_PARAM_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      utmParams[key as UtmParam] = value;
    }
  }

  return utmParams;
}

/**
 * Check if there are any UTM params in the object.
 */
export function hasUtmParams(params: UtmParams): boolean {
  return Object.keys(params).length > 0;
}

/**
 * Build a URL preserving UTM parameters from the current URL.
 * @param basePath - The base path to navigate to
 * @param currentSearchParams - The current URL search params
 * @param additionalParams - Additional params to add (will not override UTM)
 */
export function buildUrlWithUtm(
  basePath: string,
  currentSearchParams: URLSearchParams,
  additionalParams?: Record<string, string>
): string {
  const params = new URLSearchParams();

  // First, add any additional params
  if (additionalParams) {
    for (const [key, value] of Object.entries(additionalParams)) {
      params.set(key, value);
    }
  }

  // Then, preserve UTM params from current URL
  for (const key of UTM_PARAM_KEYS) {
    const value = currentSearchParams.get(key);
    if (value) {
      params.set(key, value);
    }
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Read stored UTM params from localStorage (session persistence).
 */
export function readUtmFromStorage(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as UtmParams;
  } catch {
    return {};
  }
}

/**
 * Write UTM params to localStorage for session persistence.
 * Only writes if there are params and storage is empty (first-touch).
 */
export function writeUtmToStorage(params: UtmParams): void {
  if (typeof window === 'undefined') return;
  if (!hasUtmParams(params)) return;

  try {
    // Only store on first touch - don't overwrite existing
    const existing = localStorage.getItem(UTM_STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
    }
  } catch {
    // Silently fail if storage is unavailable
  }
}

/**
 * Hook that ensures UTM parameters are persisted in localStorage for cross-redirect preservation.
 * 
 * PostHog automatically captures UTM params from the URL and sets them as person properties
 * ($initial_utm_source, $initial_utm_medium, etc.) - see:
 * https://posthog.com/docs/data/utm-segmentation
 * 
 * Our job is just to:
 * 1. Preserve UTM params in the URL across redirects (handled by useBuildUrlWithUtm)
 * 2. Store them in localStorage as a fallback for edge cases
 * 
 * PostHog handles the actual capture and attribution automatically when UTMs are in the URL.
 */
export function useUtmCapture(): void {
  const searchParams = useSearchParams();
  const hasCaptured = useRef(false);

  useEffect(() => {
    // Only run once per session
    if (hasCaptured.current) return;
    hasCaptured.current = true;

    // Extract UTM from URL and store to localStorage for persistence across redirects
    const urlUtm = extractUtmParams(searchParams);

    if (hasUtmParams(urlUtm)) {
      writeUtmToStorage(urlUtm);
      console.log('[UTM] Stored UTM params for redirect preservation:', urlUtm);
    }
  }, [searchParams]);
}

/**
 * Hook that returns a function to build redirect URLs with UTM preservation.
 * Use this when performing redirects to maintain UTM tracking.
 */
export function useBuildUrlWithUtm() {
  const searchParams = useSearchParams();

  return useCallback(
    (basePath: string, additionalParams?: Record<string, string>) => {
      return buildUrlWithUtm(basePath, searchParams, additionalParams);
    },
    [searchParams]
  );
}

