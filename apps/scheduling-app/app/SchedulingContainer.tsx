'use client';

import { useState } from 'react';
import { SchedulingActivity, type GetProvidersInputType, type LocationState } from '@awell-health/sol-scheduling';
import {
  useProvider,
  useProviders,
  useAvailability,
  useBooking,
  useCompleteActivity
} from './hooks';
import '@awell-health/sol-scheduling/style.css';



export const SchedulingContainer = () => {
  // Configuration - these would normally come from environment or props
  const baseUrl = process.env.NEXT_PUBLIC_SOL_API_URL || 'https://api.example.com';
  const patientName = 'Demo Patient';
  const salesforceLeadId = undefined; // Optional

  // Default provider preferences - with some defaults for testing
  const [providerPreferences] = useState<GetProvidersInputType>({
    age: "35",
    gender: undefined,
    ethnicity: undefined,
    therapeuticModality: undefined,
    clinicalFocus: undefined,
    deliveryMethod: undefined,
    location: {
      state: "CO" as LocationState,
      facility: undefined,
    },
  });

  // Use individual hooks for each API operation
  const { fetchProvider } = useProvider({ baseUrl });
  const { fetchProviders } = useProviders({ baseUrl });
  const { fetchAvailability } = useAvailability({ baseUrl });
  const { onBooking } = useBooking({ baseUrl, patientName, salesforceLeadId });
  const { onCompleteActivity } = useCompleteActivity();

  return (
    <SchedulingActivity
      providerPreferences={providerPreferences}
      fetchProvider={fetchProvider}
      fetchProviders={fetchProviders}
      fetchAvailability={fetchAvailability}
      onBooking={onBooking}
      onCompleteActivity={onCompleteActivity}
      opts={{
        allowSchedulingInThePast: false,
      }}
    />
  );
};