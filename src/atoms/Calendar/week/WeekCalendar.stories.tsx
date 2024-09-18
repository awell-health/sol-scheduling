import type { Meta, StoryObj } from '@storybook/react';
import { WeekCalendar as WeekCalendarComponent } from './WeekCalendar';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { SolApiProvider } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse
} from '@/lib/api/__mocks__';
import { PreferencesProvider } from '@/PreferencesProvider';

const meta: Meta<typeof WeekCalendarComponent> = {
  title: 'Atoms/Calendar/Week',
  component: WeekCalendarComponent,
  args: { onSelect: fn() },
  decorators: [
    (Story) => {
      return (
        <ThemeProvider accentColor='#A45128'>
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
        </ThemeProvider>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Week: Story = {
  args: {
    weekStartsOn: 'monday',
    // availabilities: [
    //   {
    //     eventId: 'event-0',
    //     slotstart: addDays(new Date(), -2),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-1',
    //     slotstart: addDays(new Date(), 1),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-2',
    //     slotstart: addDays(new Date(), 1),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-3',
    //     slotstart: addDays(new Date(), 1),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'virtual only'
    //   },
    //   {
    //     eventId: 'event-4',
    //     slotstart: addDays(new Date(), 1),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'virtual only'
    //   },
    //   {
    //     eventId: 'event-5',
    //     slotstart: addDays(new Date(), 2),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-6',
    //     slotstart: addDays(new Date(), 2),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-6',
    //     slotstart: addDays(new Date(), 3),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-8',
    //     slotstart: addDays(new Date(), 5),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-9',
    //     slotstart: addDays(new Date(), 13),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-10',
    //     slotstart: addDays(new Date(), 12),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-11',
    //     slotstart: addDays(new Date(), 11),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-12',
    //     slotstart: addDays(new Date(), 11),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-13',
    //     slotstart: addDays(new Date(), 10),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'CO - Cherry Creek',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-14',
    //     slotstart: addDays(new Date(), 9),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   },
    //   {
    //     eventId: 'event-15',
    //     slotstart: addDays(new Date(), 9),
    //     duration: 30,
    //     providerId: 'provider-1',
    //     facility: 'NY - Union Square',
    //     location: 'both'
    //   }
    // ],
    hideWeekends: true
  }
};
