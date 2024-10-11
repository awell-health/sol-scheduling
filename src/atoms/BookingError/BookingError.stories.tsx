import type { Meta, StoryObj } from '@storybook/react';
import { BookingError as BookingErrorComponent } from './BookingError';
import { ThemeProvider } from '@awell-health/ui-library';
import { EventDeliveryMethod } from '@/lib/api/schema/atoms/EventDeliveryMethod.schema';
import { mockProviderResponse } from '@/lib/api/__mocks__';

const meta: Meta<typeof BookingErrorComponent> = {
  title: 'Atoms/BookingError',
  component: BookingErrorComponent,
  args: {},
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BookingError: Story = {
  args: {
    slot: {
      eventId: '<event_id_0>',
      providerId: '123',
      slotstart: new Date('2024-01-01'),
      duration: 60,
      facility: 'CO - Cherry Creek',
      location: EventDeliveryMethod.Telehealth
    },
    provider: mockProviderResponse.data,
    otherBookingData: {
      mode: 'Virtual'
    }
  }
};
