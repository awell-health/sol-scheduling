import type { Meta, StoryObj } from '@storybook/react';
import { Slots as SlotsComponent } from './Slots';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { EventDeliveryMethod } from '@/lib/api/schema/atoms/EventDeliveryMethod.schema';

const meta: Meta<typeof SlotsComponent> = {
  title: 'Atoms/Slots',
  component: SlotsComponent,
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

export const Slots: Story = {
  args: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    slots: [
      {
        eventId: 'event-1',
        slotstart: new Date('2024-07-12 00:00:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: 'event-2',
        slotstart: new Date('2024-07-12 00:15:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: 'event-3',
        slotstart: new Date('2024-07-12 00:30:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      }
    ]
  }
};
