'use client';

import { useState } from 'react';

type BeginIntakeButtonProps = {
  /** Session URL for the intake forms - comes from the workflow result */
  sessionUrl: string;
};

/**
 * Button to begin the intake process.
 * Since the confirmation page only loads after the workflow completes,
 * we already have the sessionUrl and can redirect directly.
 */
export function BeginIntakeButton({ sessionUrl }: BeginIntakeButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    setIsRedirecting(true);
    window.location.href = sessionUrl;
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={isRedirecting}
      className='inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-50 sm:w-auto'
    >
      {isRedirecting ? 'Opening intake forms...' : 'Complete your booking'}
    </button>
  );
}

