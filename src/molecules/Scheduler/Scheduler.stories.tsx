import type { Meta, StoryObj } from '@storybook/react';
import { Scheduler as SchedulerComponent } from './Scheduler';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { SlotType } from '../../atoms/Slots';

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
    const [selectedSlot, setSelectedSlot] = useState<SlotType | undefined>(
      args.slot || undefined
    );

    const handleDateSelect = (date: Date) => {
      setSelectedSlot(undefined);
      setSelectedDate(date);
      args.onDateSelect(date);
    };

    const handleSlotSelect = (slot: SlotType) => {
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
      {
        eventId: 'event-0',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), -1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-1',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-2',
        startDate: addDays(new Date().setUTCHours(11, 0, 0), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-3',
        startDate: addDays(new Date().setUTCHours(14, 0, 0), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-4',
        startDate: addDays(new Date().setUTCHours(16, 0, 0), 1),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-5',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 2),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-6',
        startDate: addDays(new Date().setUTCHours(10, 0, 0), 2),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-7',
        startDate: addDays(new Date().setUTCHours(12, 0, 0), 3),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-8',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 5),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-9',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 9),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-10',
        startDate: addDays(new Date().setUTCHours(10, 0, 0), 9),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-11',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 10),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-12',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 11),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-13',
        startDate: addDays(new Date().setUTCHours(10, 0, 0), 11),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-14',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 12),
        duration: 30,
        providerId: 'provider-1'
      },
      {
        eventId: 'event-15',
        startDate: addDays(new Date().setUTCHours(9, 0, 0), 13),
        duration: 30,
        providerId: 'provider-1'
      }
    ]
  }
};
