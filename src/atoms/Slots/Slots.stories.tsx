import type { Meta, StoryObj } from '@storybook/react';
import { Slots as SlotsComponent } from './Slots';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { EventDeliveryMethod } from '@/lib/api/schema/atoms/eventDeliveryMethod.schema';
import { PreferencesProvider } from '@/PreferencesProvider';
import { SolApiProvider } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse
} from '@/lib/api/__mocks__';

const meta: Meta<typeof SlotsComponent> = {
  title: 'Atoms/Slots',
  component: SlotsComponent,
  args: { onSelect: fn() },
  decorators: [
    (Story) => (
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
            <Story />
          </PreferencesProvider>
        </SolApiProvider>
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
      },
      {
        eventId: 'event-4',
        slotstart: new Date('2024-07-12 00:45:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: 'event-5',
        slotstart: new Date('2024-07-12 01:00:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: 'event-6',
        slotstart: new Date('2024-07-12 01:15:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.VirtualOnly
      },
      {
        eventId: 'event-7',
        slotstart: new Date('2024-07-12 01:30:00 +0200'),
        duration: 30,
        providerId: 'provider-1',
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.VirtualOnly
      }
    ]
  }
};
