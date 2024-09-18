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
  mockProvidersResponse
} from '../lib/api/__mocks__';
import { useCallback, useEffect, useState } from 'react';
import {
  ClinicalFocus,
  Ethnicity,
  GetProvidersInputType,
  type SlotType
} from '../lib/api';
import { Gender } from '../lib/api';
import { some } from 'lodash-es';

const meta: Meta<typeof SchedulingActivityComponent> = {
  title: 'HostedPages/SchedulingActivity',
  component: SchedulingActivityComponent,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    onProviderSelect: fn(),
    onDateSelect: fn(),
    onSlotSelect: fn(),
    onCompleteActivity: fn(),
    fetchProviders: () => {
      console.log('Fetching providers');
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockProvidersResponse), 750)
      );
    },
    fetchAvailability: (providerId: string) => {
      console.log('Fetching availability for provider', providerId);
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(mockProviderAvailabilityResponse(providerId)),
          750
        )
      );
    },
    onBooking: fn((slot: SlotType) => {
      console.log('Booking slot', slot);
      return new Promise((resolve) =>
        setTimeout(() => resolve({ data: [] }), 1500)
      );
    }),
    providerPreferences: {
      gender: Gender.Male,
      ethnicity: Ethnicity.White,
      age: '18-65',
      clinicalFocus: [ClinicalFocus.Depression, ClinicalFocus.Anxiety]
    } satisfies GetProvidersInputType,
    onProviderPreferencesChange: fn()
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
export const SchedulingActivity: Story = {
  render: (args) => {
    const { updateLayoutMode, resetLayoutMode } = useTheme();

    useEffect(() => {
      updateLayoutMode('flexible');

      return () => {
        // Reset to default mode on unmount
        resetLayoutMode();
      };
    }, []);

    const [providerPrefs, setProviderPrefs] = useState<GetProvidersInputType>(
      args.providerPreferences as GetProvidersInputType
    );

    const handlePrefsChange = (prefs: GetProvidersInputType) => {
      console.log('Prefs changed', prefs);
      setProviderPrefs(prefs);
      fetchProvidersFn();
    };

    const fetchProvidersFn = useCallback(async () => {
      const { data, ...rest } = await args.fetchProviders(providerPrefs);
      console.log('fetched providers');
      return {
        data: data.filter((p) => {
          if (
            providerPrefs.clinicalFocus &&
            providerPrefs.clinicalFocus.length > 0
          ) {
            return some(
              providerPrefs.clinicalFocus.map((f) =>
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
    }, [providerPrefs]);

    const fetchAvailabilityFn = useCallback(
      (_providerId: string) => args.fetchAvailability(_providerId),
      []
    );

    const bookAppointmentFn = useCallback((_slot: SlotType) => {
      return args.onBooking(_slot);
    }, []);

    const completeActivity = useCallback(
      (_slot: SlotType, _preferences: GetProvidersInputType) => {
        console.log('Complete activity with slot', _slot);
        return args.onCompleteActivity(_slot, _preferences);
      },
      []
    );

    return (
      <SchedulingActivityComponent
        providerId={args.providerId}
        timeZone={args.timeZone}
        onProviderSelect={args.onProviderSelect}
        onDateSelect={args.onDateSelect}
        onSlotSelect={args.onSlotSelect}
        fetchProviders={fetchProvidersFn}
        onCompleteActivity={completeActivity}
        onBooking={bookAppointmentFn}
        fetchAvailability={fetchAvailabilityFn}
        providerPreferences={providerPrefs}
        onProviderPreferencesChange={handlePrefsChange}
      />
    );
  },
  args: {
    opts: {
      allowSchedulingInThePast: false
    }
  }
};
