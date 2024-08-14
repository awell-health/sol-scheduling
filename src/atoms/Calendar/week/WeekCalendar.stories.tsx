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
      { eventId: 'event-1', startDate: addDays(new Date(), 1), duration: 30 },
      { eventId: 'event-2', startDate: addDays(new Date(), 1), duration: 30 },
      { eventId: 'event-3', startDate: addDays(new Date(), 1), duration: 30 },
      { eventId: 'event-4', startDate: addDays(new Date(), 1), duration: 30 },
      { eventId: 'event-5', startDate: addDays(new Date(), 2), duration: 30 },
      { eventId: 'event-6', startDate: addDays(new Date(), 2), duration: 30 },
      { eventId: 'event-6', startDate: addDays(new Date(), 3), duration: 30 },
      { eventId: 'event-8', startDate: addDays(new Date(), 5), duration: 30 },
      { eventId: 'event-9', startDate: addDays(new Date(), 13), duration: 30 },
      { eventId: 'event-10', startDate: addDays(new Date(), 12), duration: 30 },
      { eventId: 'event-11', startDate: addDays(new Date(), 11), duration: 30 },
      { eventId: 'event-12', startDate: addDays(new Date(), 11), duration: 30 },
      { eventId: 'event-13', startDate: addDays(new Date(), 10), duration: 30 },
      { eventId: 'event-14', startDate: addDays(new Date(), 9), duration: 30 },
      { eventId: 'event-15', startDate: addDays(new Date(), 9), duration: 30 }
    ],
    hideWeekends: true
  }
};
