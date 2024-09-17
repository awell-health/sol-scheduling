import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';
import { ThemeProvider } from '@awell-health/ui-library';

import { type SlotType } from '../../lib/api';
import { Scheduler as SchedulerComponent } from './Scheduler';

const meta: Meta<typeof SchedulerComponent> = {
  title: 'Molecules/Scheduler',
  component: SchedulerComponent,
  args: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    onDateSelect: fn(),
    onSlotSelect: fn(),
    onBooking: fn()
  },
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

    const handleDateSelect = (date?: Date) => {
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
        slotstart: addDays(new Date().setUTCHours(9, 0, 0), -1),
        duration: 30,
        providerId: 'provider-1',
        facility: 'NY - Union Square'
      },
      {
        eventId: 'event-1',
        slotstart: new Date('2024-09-18T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-2',
        slotstart: new Date('2024-09-18T11:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-3',
        slotstart: new Date('2024-09-18T14:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-4',
        slotstart: new Date('2024-09-18T16:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-5',
        slotstart: new Date('2024-09-19T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'NY - Union Square'
      },
      {
        eventId: 'event-6',
        slotstart: new Date('2024-09-19T10:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'NY - Union Square'
      },
      {
        eventId: 'event-7',
        slotstart: new Date('2024-09-20T12:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-8',
        slotstart: new Date('2024-09-22T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-9',
        slotstart: new Date('2024-09-26T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'NY - Union Square'
      },
      {
        eventId: 'event-10',
        slotstart: new Date('2024-09-26T10:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'NY - Union Square'
      },
      {
        eventId: 'event-11',
        slotstart: new Date('2024-09-27T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'NY - Union Square'
      },
      {
        eventId: 'event-12',
        slotstart: new Date('2024-09-28T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-13',
        slotstart: new Date('2024-09-28T10:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-14',
        slotstart: new Date('2024-09-29T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      },
      {
        eventId: 'event-15',
        slotstart: new Date('2024-09-30T09:00:00.172Z'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek'
      }
    ]
  }
};
