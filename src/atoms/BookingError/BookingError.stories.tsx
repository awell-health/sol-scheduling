import type { Meta, StoryObj } from '@storybook/react';
import { BookingError as BookingErrorComponent } from './BookingError';
import { ThemeProvider } from '@awell-health/ui-library';
import { SolApiProvider } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse
} from '@/lib/api/__mocks__';
import { fn } from '@storybook/test';
import { PreferencesProvider } from '@/PreferencesProvider';

const meta: Meta<typeof BookingErrorComponent> = {
  title: 'Atoms/BookingError',
  component: BookingErrorComponent,
  args: {},
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
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Story />
            </div>
          </PreferencesProvider>
        </SolApiProvider>
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BookingError: Story = {
  args: {
    otherBookingData: {
      mode: 'Virtual'
    }
  }
};
