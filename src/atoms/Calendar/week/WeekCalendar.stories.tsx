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
      addDays(new Date(), 1),
      addDays(new Date(), 1),
      addDays(new Date(), 1),
      addDays(new Date(), 1),
      addDays(new Date(), 2),
      addDays(new Date(), 2),
      addDays(new Date(), 3),
      addDays(new Date(), 5),
      addDays(new Date(), 13),
      addDays(new Date(), 12),
      addDays(new Date(), 11),
      addDays(new Date(), 11),
      addDays(new Date(), 10),
      addDays(new Date(), 9),
      addDays(new Date(), 9)
    ],
    hideWeekends: true
  }
};
