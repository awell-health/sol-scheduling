'use client';

import { useState, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ALL_US_STATES, FIELD_REGISTRY, FieldId } from '@/lib/fields';

type StateQuestionProps = {
  value: string | null;
  onChange: (value: string) => void;
  onContinue: () => void;
};

/**
 * Attempt to get US state code from browser geolocation.
 * Uses reverse geocoding via a free API.
 */
async function getStateFromGeolocation(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using OpenStreetMap Nominatim for reverse geocoding (free, no API key)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'SOL-Scheduling-App'
              }
            }
          );
          const data = await response.json();
          const stateCode = data?.address?.['ISO3166-2-lvl4']?.split('-')[1];
          resolve(stateCode || null);
        } catch {
          resolve(null);
        }
      },
      () => {
        resolve(null);
      },
      { timeout: 10000 }
    );
  });
}

export function StateQuestion({ value, onChange, onContinue }: StateQuestionProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);

    const stateCode = await getStateFromGeolocation();

    if (stateCode) {
      // Don't auto-fill if Texas is detected
      if (stateCode === 'TX') {
        setLocationError(
          'Texas is not available. Please select your state manually.'
        );
      } else {
        // Check if it's a valid US state
        const isValid = ALL_US_STATES.some((s) => s.code === stateCode);
        if (isValid) {
          onChange(stateCode);
        } else {
          setLocationError("We couldn't detect a valid US state.");
        }
      }
    } else {
      setLocationError(
        'Unable to detect your location. Please select your state manually.'
      );
    }

    setIsLocating(false);
  }, [onChange]);

  const canContinue = value !== null && value !== '';

  const stateField = FIELD_REGISTRY[FieldId.STATE];

  return (
    <div className='mx-auto w-full max-w-2xl space-y-6 px-1 md:px-0'>
      <div>
        <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
          {stateField.conversationalQuestion ?? stateField.label}
        </h2>
        <p className='mt-2 text-sm text-slate-700 md:mt-3 md:text-lg'>
          {stateField.conversationalDescription ?? stateField.description}
        </p>
      </div>

      <div className='space-y-4'>
        <Select value={value ?? ''} onValueChange={onChange}>
          <SelectTrigger className='h-14 w-full text-base' data-phi='true' data-attr-redact='true'>
            <SelectValue placeholder='Select your state' />
          </SelectTrigger>
          <SelectContent className='max-h-[300px]'>
            {ALL_US_STATES.filter((state) => state.code !== 'TX').map((state) => (
              <SelectItem key={state.code} value={state.code}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='flex items-center gap-3'>
          <div className='h-px flex-1 bg-slate-200' />
          <span className='text-xs text-slate-500'>or</span>
          <div className='h-px flex-1 bg-slate-200' />
        </div>

        <button
          type='button'
          onClick={handleUseLocation}
          disabled={isLocating}
          className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isLocating ? (
            <>
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-primary' />
              Detecting location…
            </>
          ) : (
            <>
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              Use my location
            </>
          )}
        </button>

        {locationError && (
          <p className='text-center text-sm text-amber-700'>{locationError}</p>
        )}

        <Button
          type='button'
          onClick={onContinue}
          disabled={!canContinue}
          flashOnClick
          size='lg'
          className='w-full'
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
