import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@awell-health/ui-library';
import { SchedulingActivity as SchedulingActivityComponent } from './SchedulingActivity';
import { fn } from '@storybook/test';
import {
  mockProviderAvailabilityResponse,
  mockProvidersResponse
} from '../lib/api/__mocks__';

const meta: Meta = {
  title: 'HostedPages/SchedulingActivity',
  component: SchedulingActivityComponent,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    onProviderSelect: fn(),
    onDateSelect: fn(),
    onSlotSelect: fn(),
    onCompleteActivity: fn(),
    fetchProviders: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve(mockProvidersResponse), 750)
      ),
    fetchAvailability: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve(mockProviderAvailabilityResponse), 750)
      ),
    onBooking: () =>
      new Promise((resolve) => setTimeout(() => resolve(true), 1500))
  },
  decorators: [
    (StoryComponent) => (
      <ThemeProvider accentColor='#A45128'>
        <StoryComponent />
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SchedulingActivity: Story = {
  args: {}
};
