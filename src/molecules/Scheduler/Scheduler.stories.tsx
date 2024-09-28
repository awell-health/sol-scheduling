import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@awell-health/ui-library';

import { Scheduler as SchedulerComponent } from './Scheduler';
import { SolApiProvider, useSolApi } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse,
  mockProviderResponse
} from '@/lib/api/__mocks__';
import { PreferencesProvider } from '@/PreferencesProvider';
import { useEffect } from 'react';
import { action } from '@storybook/addon-actions';
import {
  type BookAppointmentResponseType,
  type GetProviderResponseType
} from '@/lib/api';

const meta: Meta<typeof SchedulerComponent> = {
  title: 'Molecules/Scheduler',
  component: SchedulerComponent,
  decorators: [
    (Story) => {
      return (
        <ThemeProvider accentColor='#A45128'>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <SolApiProvider
              fetchAvailability={async (pid) => {
                action('fetchAvailability')(pid);
                return Promise.resolve(mockProviderAvailabilityResponse(pid));
              }}
              fetchProvider={async (pid) => {
                action('fetchProvider')(pid);

                const data = (await new Promise((resolve) =>
                  setTimeout(() => resolve(mockProviderResponse), 1500)
                )) as GetProviderResponseType;

                return data;
              }}
              fetchProviders={mockFetchProvidersFn}
              bookAppointment={async (_slot) => {
                action('bookAppointment')(_slot);

                const data = new Promise((resolve) =>
                  setTimeout(() => resolve({ data: [] }), 1500)
                ) as BookAppointmentResponseType;

                return data;
              }}
              completeActivity={async (_slot, _preferences) => {
                action('completeActivity')({
                  slot: _slot,
                  preferences: _preferences
                });
              }}
            >
              <PreferencesProvider initialPreferences={{}}>
                <div style={{ maxWidth: '750px', margin: '0 auto' }}>
                  <Story />
                </div>
              </PreferencesProvider>
            </SolApiProvider>
          </div>
        </ThemeProvider>
      );
    }
  ],
  parameters: {
    chromatic: { delay: 10000 }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduler: Story = {
  render: (args) => {
    const {
      provider: { setId: setProviderId }
    } = useSolApi();

    useEffect(() => {
      setProviderId('test-provider-id');
    }, []);

    return <SchedulerComponent {...args} />;
  }
};
