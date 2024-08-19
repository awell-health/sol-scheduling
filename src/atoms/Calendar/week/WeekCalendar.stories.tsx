import type { Meta, StoryObj } from '@storybook/react';
import { WeekCalendar as WeekCalendarComponent } from './WeekCalendar';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';

const meta: Meta<typeof WeekCalendarComponent> = {
  title: 'Atoms/Calendar/Week',
  component: WeekCalendarComponent,
  args: { onSelect: fn() },
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <Story />
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Week: Story = {
  args: {
    loading: false,
    weekStartsOn: 'monday',
    availabilities: [
      {
        eventId: 'event-0',
        slotstart: addDays(new Date(), -2),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-1',
        slotstart: addDays(new Date(), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-2',
        slotstart: addDays(new Date(), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-3',
        slotstart: addDays(new Date(), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-4',
        slotstart: addDays(new Date(), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-5',
        slotstart: addDays(new Date(), 2),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-6',
        slotstart: addDays(new Date(), 2),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-6',
        slotstart: addDays(new Date(), 3),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-8',
        slotstart: addDays(new Date(), 5),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-9',
        slotstart: addDays(new Date(), 13),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-10',
        slotstart: addDays(new Date(), 12),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-11',
        slotstart: addDays(new Date(), 11),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-12',
        slotstart: addDays(new Date(), 11),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-13',
        slotstart: addDays(new Date(), 10),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-14',
        slotstart: addDays(new Date(), 9),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-15',
        slotstart: addDays(new Date(), 9),
        duration: 30,
        providerId: 'provider-1'
      }
    ],
    hideWeekends: true
  }
};
