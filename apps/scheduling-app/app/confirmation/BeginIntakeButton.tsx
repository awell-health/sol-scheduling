'use client';

import { useState } from 'react';
import { startIntakeFormAction, type EventDetails } from './actions';
import { getAnyStoredLeadId } from '../providers/_lib/salesforce';

type BeginIntakeButtonProps = {
  eventId: string;
  eventDetails: EventDetails;
};

export function BeginIntakeButton({ eventId, eventDetails }: BeginIntakeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    const salesforceLeadId = getAnyStoredLeadId();
    
    await startIntakeFormAction({
      eventId,
      eventDetails,
      salesforceLeadId: salesforceLeadId ?? undefined,
    });
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={isLoading}
      className='inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:opacity-50 sm:w-auto'
    >
      {isLoading ? 'Starting…' : 'Complete your booking'}
    </button>
  );
}
