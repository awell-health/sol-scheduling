import '../../styles/globals.css';
import { FC } from 'react';
import { isNil, merge } from 'lodash-es';
import { SchedulingActivityProps } from './types';
import { PreferencesProvider } from '../PreferencesProvider';
import { SolApiProvider } from '../SolApiProvider/SolApiContext';
import { SchedulingWizard } from '../SchedulingWizard';
import { GetProvidersInputType } from '@/lib/api';

export const SchedulingActivity: FC<SchedulingActivityProps> = ({
  providerId: prefilledProviderId,
  providerPreferences,
  fetchProviders,
  fetchAvailability,
  onBooking,
  onCompleteActivity
}) => {
  const shouldSkipProviderSelection = !isNil(prefilledProviderId);
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
      fetchAvailability={fetchAvailability}
      fetchProviders={fetchProviders}
      completeActivity={onCompleteActivity}
      bookAppointment={onBooking}
    >
      <main
        id='ahp_main_content_with_scroll_hint'
        className='flex-1'
        data-theme='sol'
      >
        <div className='max-w-[650px] px-4 py-0 mx-auto my-0 relative'>
          <PreferencesProvider initialPreferences={filledProviderPreferences}>
            <SchedulingWizard
              shouldSkipProviderSelection={shouldSkipProviderSelection}
              onCompleteActivity={onCompleteActivity}
            />
          </PreferencesProvider>
        </div>
      </main>
    </SolApiProvider>
  );
};
