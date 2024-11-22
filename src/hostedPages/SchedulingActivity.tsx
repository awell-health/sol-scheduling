import '../../styles/globals.css';
import React from 'react';
import { isEmpty, merge } from 'lodash-es';
import { SchedulingActivityProps } from './types';
import { PreferencesProvider } from '../PreferencesProvider';
import { SolApiProvider } from '../SolApiProvider/SolApiContext';
import { SchedulingWizard } from '../SchedulingWizard';
import { GetProvidersInputType } from '@/lib/api';

export const SchedulingActivity: React.FC<SchedulingActivityProps> = ({
  providerId: prefilledProviderId,
  providerPreferences,
  fetchProvider,
  fetchProviders,
  fetchAvailability,
  onBooking,
  onCompleteActivity
}) => {
  const shouldSkipProviderSelection = !isEmpty(prefilledProviderId);

  const filledProviderPreferences: GetProvidersInputType = merge(
    {},
    {
      location: {
        state: undefined,
        facility: undefined
      },
      gender: undefined,
      ethnicity: undefined,
      language: undefined,
      age: undefined,
      clinicalFocus: undefined,
      therapeuticModality: undefined
    },
    providerPreferences
  );

  return (
    <SolApiProvider
      fetchProviders={fetchProviders}
      fetchProvider={fetchProvider}
      fetchAvailability={fetchAvailability}
      completeActivity={onCompleteActivity}
      bookAppointment={onBooking}
    >
      <main
        id='ahp_main_content_with_scroll_hint'
        className='flex-1'
        data-theme='sol'
      >
        <div className='max-w-[650px] px-4 py-0 mx-auto my-0 relative'>
          <PreferencesProvider
            initialPreferences={filledProviderPreferences}
            skipProviderSelection={shouldSkipProviderSelection}
          >
            <SchedulingWizard
              shouldSkipProviderSelection={shouldSkipProviderSelection}
              onCompleteActivity={onCompleteActivity}
              prefilledProviderId={prefilledProviderId}
            />
          </PreferencesProvider>
        </div>
      </main>
    </SolApiProvider>
  );
};
