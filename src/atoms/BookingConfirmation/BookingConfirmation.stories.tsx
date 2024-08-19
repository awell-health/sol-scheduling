import type { Meta, StoryObj } from '@storybook/react';
import { BookingConfirmation as BookingConfirmationComponent } from './BookingConfirmation';
import { ThemeProvider } from '@awell-health/ui-library';

const meta: Meta<typeof BookingConfirmationComponent> = {
  title: 'Atoms/BookingConfirmation',
  component: BookingConfirmationComponent,
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

export const BookingConfirmation: Story = {
  args: {
    slot: {
      eventId: 'event-1',
      slotstart: new Date(),
      duration: 30,
      providerId: 'provider-1'
    },
    providerName: 'Nick Hellemans',
    otherBookingData: {
      mode: 'Virtual'
    }
  }
};
