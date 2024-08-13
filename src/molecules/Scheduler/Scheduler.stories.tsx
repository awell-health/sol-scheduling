import type { Meta, StoryObj } from '@storybook/react';
import { Scheduler as SchedulerComponent } from './Scheduler';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';
import { useState } from 'react';

const meta: Meta<typeof SchedulerComponent> = {
  title: 'Molecules/Scheduler',
  component: SchedulerComponent,
  args: { onDateSelect: fn(), onSlotSelect: fn(), onBooking: fn() },
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduler: Story = {
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      args.date || undefined
    );
    const [selectedSlot, setSelectedSlot] = useState<Date | undefined>(
      args.slot || undefined
    );

    const handleDateSelect = (date: Date) => {
      setSelectedSlot(undefined);
      setSelectedDate(date);
      args.onDateSelect(date);
    };

    const handleSlotSelect = (slot: Date) => {
      setSelectedSlot(slot);
      args.onSlotSelect(slot);
    };

    return (
      <SchedulerComponent
        {...args}
        date={selectedDate}
        slot={selectedSlot}
        onDateSelect={handleDateSelect}
        onSlotSelect={handleSlotSelect}
      />
    );
  },
  args: {
    provider: {
      name: 'Nick Hellemans'
    },
    timeZone: 'Europe/Brussels',
    availabilities: [
      addDays(new Date().setUTCHours(9, 0), 1),
      addDays(new Date().setUTCHours(11, 0), 1),
      addDays(new Date().setUTCHours(14, 0), 1),
      addDays(new Date().setUTCHours(16, 0), 1),
      addDays(new Date().setUTCHours(9, 0), 2),
      addDays(new Date().setUTCHours(10, 0), 2),
      addDays(new Date().setUTCHours(12, 0), 3),
      addDays(new Date().setUTCHours(9, 0), 5),
      addDays(new Date().setUTCHours(9, 0), 9),
      addDays(new Date().setUTCHours(10, 0), 9),
      addDays(new Date().setUTCHours(9, 0), 10),
      addDays(new Date().setUTCHours(9, 0), 11),
      addDays(new Date().setUTCHours(10, 0), 11),
      addDays(new Date().setUTCHours(9, 0), 12),
      addDays(new Date().setUTCHours(9, 0), 13)
    ]
  }
};
