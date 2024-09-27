import type { Meta, StoryObj } from '@storybook/react';
import {
  HostedPageLayout,
  ThemeProvider,
  useTheme
} from '@awell-health/ui-library';
import { SchedulingActivity as SchedulingActivityComponent } from './SchedulingActivity';
import { fn } from '@storybook/test';
import {
  mockProviderAvailabilityResponse,
  mockProviderResponse,
  mockProvidersResponse
} from '../lib/api/__mocks__';
import { useCallback, useEffect } from 'react';
import {
  type BookAppointmentResponseType,
  type GetAvailabilitiesResponseType,
  type GetProvidersInputType,
  type GetProvidersResponseType,
  type GetProviderInputType,
  type GetProviderResponseType
} from '../lib/api';
import { some } from 'lodash-es';
import { SelectedSlot } from '@/lib/api/schema/shared.schema';
import { type SalesforcePreferencesType } from '@/lib/utils/preferences';

const meta: Meta<typeof SchedulingActivityComponent> = {
  title: 'HostedPages/SchedulingActivity/SkipProvider',
  component: SchedulingActivityComponent,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    onCompleteActivity: fn(),
    fetchProviders: fn(),
    fetchAvailability: fn(),
    fetchProvider: fn(),
    onBooking: fn(),
    providerPreferences: {} // when we skip the provider stage, user will have no preferences set
  },
  decorators: [
    (StoryComponent) => (
      <ThemeProvider accentColor='#A45128'>
        <HostedPageLayout
          logo={undefined}
          onCloseHostedPage={() => alert('Stop session')}
        >
          <StoryComponent />
        </HostedPageLayout>
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story resembles the implemntation in Hosted Pages
 */
export const SkipProvider: Story = {
  render: (args) => {
    const { updateLayoutMode, resetLayoutMode } = useTheme();
    const initialPrefs: GetProvidersInputType = args.providerPreferences;

    useEffect(() => {
      updateLayoutMode('flexible');

      return () => {
        // Reset to default mode on unmount
        resetLayoutMode();
      };
    }, []);

    const fetchProvidersFn = useCallback(
      async (preferences: GetProvidersInputType) => {
        // Spy on the action, useful for debugging
        args.fetchProviders(preferences);

        const { data, ...rest } = (await new Promise((resolve) =>
          setTimeout(() => resolve(mockProvidersResponse), 750)
        )) as GetProvidersResponseType;

        return {
          data: data.filter((p) => {
            if (
              preferences.clinicalFocus &&
              preferences.clinicalFocus.length > 0
            ) {
              return some(
                preferences.clinicalFocus.map((f) =>
                  p.clinicalFocus
                    ?.map((cf) => cf.toLowerCase())
                    .includes(f.toLowerCase())
                )
              );
            } else {
              return true;
            }
          }),
          ...rest
        };
      },
      []
    );

    const fetchProviderFn = useCallback(async (input: GetProviderInputType) => {
      // Spy on the action, useful for debugging
      args.fetchProvider(input);

      const data = (await new Promise((resolve) =>
        setTimeout(() => resolve(mockProviderResponse), 750)
      )) as GetProviderResponseType;

      return data;
    }, []);

    const fetchAvailabilityFn = useCallback(async (_providerId: string) => {
      args.fetchAvailability(_providerId);

      const data = (await new Promise((resolve) =>
        setTimeout(
          () => resolve(mockProviderAvailabilityResponse(_providerId)),
          750
        )
      )) as GetAvailabilitiesResponseType;

      return data;
    }, []);

    const bookAppointmentFn = useCallback(async (_slot: SelectedSlot) => {
      args.onBooking(_slot);

      const data = new Promise((resolve) =>
        setTimeout(() => resolve({ data: [] }), 1500)
      ) as BookAppointmentResponseType;

      return data;
    }, []);

    const completeActivity = useCallback(
      (_slot: SelectedSlot, _preferences: SalesforcePreferencesType) => {
        console.log('Complete activity with slot', _slot);
        return args.onCompleteActivity(_slot, _preferences);
      },
      []
    );

    return (
      <SchedulingActivityComponent
        providerId={args.providerId}
        fetchProvider={fetchProviderFn}
        fetchProviders={fetchProvidersFn}
        onCompleteActivity={completeActivity}
        onBooking={bookAppointmentFn}
        fetchAvailability={fetchAvailabilityFn}
        providerPreferences={initialPrefs}
      />
    );
  },
  args: {
    opts: {
      allowSchedulingInThePast: false
    },
    providerId: '123'
  }
};
