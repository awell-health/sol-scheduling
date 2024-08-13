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
    date: new Date(),
    providerName: 'Nick Hellemans',
    duration: 60,
    otherBookingData: {
      mode: 'Virtual'
    }
  }
};
