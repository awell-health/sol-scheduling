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
  const patientName = 'JB Test';
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

  // Use individual hooks for each API operation (server actions handle SOL_API_URL internally)
  const { fetchProvider } = useProvider();
  const { fetchProviders } = useProviders();
  const { fetchAvailability } = useAvailability();
  const { onBooking } = useBooking({ patientName, salesforceLeadId });
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