import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@awell-health/ui-library';

import { Scheduler as SchedulerComponent } from './Scheduler';
import { SolApiProvider, useSolApi } from '@/SolApiProvider';
import { PreferencesProvider } from '@/PreferencesProvider';
import { useEffect } from 'react';
import {
  fetchProviderMock,
  fetchAvailabilityMock,
  bookAppointmentMock,
  completeActivityMock
} from './__mocks__/scheduler.mocks';
import { mockFetchProvidersFn } from '@/lib/api/__mocks__';
import { SchedulerSpec } from './Scheduler.spec';

const meta: Meta<typeof SchedulerComponent> = {
  title: 'Molecules/Scheduler',
  component: SchedulerComponent,
  parameters: {
    mockingDate: new Date('2024-10-14T18:00:00.000Z'),
    fetchAvailability: fetchAvailabilityMock
  },
  decorators: [
    (Story) => {
      return (
        <ThemeProvider accentColor='#A45128'>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <SolApiProvider
              fetchAvailability={fetchAvailabilityMock}
              fetchProvider={fetchProviderMock}
              fetchProviders={mockFetchProvidersFn}
              bookAppointment={bookAppointmentMock}
              completeActivity={completeActivityMock}
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
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Component: Story = {
  render: (args) => {
    const {
      provider: { setId: setProviderId }
    } = useSolApi();

    useEffect(() => {
      setProviderId('1637');
    }, []);

    return <SchedulerComponent {...args} />;
  }
};

export const InteractionTest: Story = {
  play: SchedulerSpec,
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
