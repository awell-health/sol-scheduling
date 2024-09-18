import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ThemeProvider } from '@awell-health/ui-library';

import { Scheduler as SchedulerComponent } from './Scheduler';
import { SolApiProvider } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse
} from '@/lib/api/__mocks__';
import { PreferencesProvider } from '@/PreferencesProvider';

const meta: Meta<typeof SchedulerComponent> = {
  title: 'Molecules/Scheduler',
  component: SchedulerComponent,
  args: {},
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <SolApiProvider
            fetchAvailability={(pid) =>
              Promise.resolve(mockProviderAvailabilityResponse(pid))
            }
            fetchProviders={mockFetchProvidersFn}
            bookAppointment={fn()}
            completeActivity={fn()}
          >
            <PreferencesProvider initialPreferences={{}}>
              <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <Story />
              </div>
            </PreferencesProvider>
          </SolApiProvider>
        </div>
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduler: Story = {
  render: (args) => {
    return <SchedulerComponent {...args} />;
  },
  args: {
    // provider: {
    //   name: 'Nick Hellemans'
    // },
    // timeZone: 'Europe/Brussels',
    // availabilities: [
    //   {
    //     eventId: 'event-0',
    //     slotstart: addDays(new Date().setUTCHours(9, 0, 0), -1),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-1',
    //     slotstart: new Date('2024-09-18T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-2',
    //     slotstart: new Date('2024-09-18T11:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-3',
    //     slotstart: new Date('2024-09-18T14:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-4',
    //     slotstart: new Date('2024-09-18T16:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-5',
    //     slotstart: new Date('2024-09-19T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-6',
    //     slotstart: new Date('2024-09-19T10:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-7',
    //     slotstart: new Date('2024-09-20T12:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-8',
    //     slotstart: new Date('2024-09-22T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-9',
    //     slotstart: new Date('2024-09-26T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-10',
    //     slotstart: new Date('2024-09-26T10:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-11',
    //     slotstart: new Date('2024-09-27T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-12',
    //     slotstart: new Date('2024-09-28T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-13',
    //     slotstart: new Date('2024-09-28T10:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-14',
    //     slotstart: new Date('2024-09-29T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-15',
    //     slotstart: new Date('2024-09-30T09:00:00.172Z'),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   }
    // ]
  }
};
