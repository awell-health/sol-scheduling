import type { Meta, StoryObj } from '@storybook/react';
import { AvailabilitySlots as SlotsComponent } from './AvailabilitySlots';
import { ThemeProvider } from '@awell-health/ui-library';
import { EventDeliveryMethod } from '@/lib/api/schema/atoms/EventDeliveryMethod.schema';

const meta: Meta<typeof SlotsComponent> = {
  title: 'Atoms/AvailabilitySlot',
  component: SlotsComponent,
  args: {},
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

export const AvailabilitySlots: Story = {
  args: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    slots: [
      {
        eventId: 'event-1',
        slotstart: new Date('2024-07-12 00:00:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.InPerson
      },
      {
        eventId: 'event-2',
        slotstart: new Date('2024-07-12 00:15:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.InPerson
      },
      {
        eventId: 'event-3',
        slotstart: new Date('2024-07-12 00:30:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.InPerson
      }
    ]
  }
};
