import type { Meta, StoryObj } from '@storybook/react';
import {
  HostedPageLayout,
  ThemeProvider,
  useTheme
} from '@awell-health/ui-library';
import { SchedulingActivity as SchedulingActivityComponent } from './SchedulingActivity';
import { fn } from '@storybook/test';
import {
  mockProviderAvailabilityResponse,
  mockProvidersResponse
} from '../lib/api/__mocks__';
import { useCallback, useEffect, useState } from 'react';
import { SlotType } from 'atoms/Slots';

const meta: Meta<typeof SchedulingActivityComponent> = {
  title: 'HostedPages/SchedulingActivity',
  component: SchedulingActivityComponent,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    // onProviderSelect: fn(),
    // onDateSelect: fn(),
    // onSlotSelect: fn(),
    // onCompleteActivity: fn(),
    fetchProviders: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve(mockProvidersResponse), 750)
      ),
    fetchAvailability: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve(mockProviderAvailabilityResponse), 750)
      ),
    onBooking: fn(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 1500))
    )
  },
  decorators: [
    (StoryComponent) => (
      <ThemeProvider accentColor='#A45128'>
        <HostedPageLayout
          logo={
            'https://res.cloudinary.com/da7x4rzl4/image/upload/v1710884206/Developer%20portal/awell_logo.svg'
          }
          onCloseHostedPage={() => alert('Stop session')}
        >
          <StoryComponent />
        </HostedPageLayout>
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SchedulingActivity: Story = {
  render: (args) => {
    const { updateLayoutMode, resetLayoutMode } = useTheme();
    const [provider, setProvider] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [slot, setSlot] = useState<SlotType | undefined>(undefined);

    useEffect(() => {
      updateLayoutMode('flexible');

      return () => {
        // Reset to default mode on unmount
        resetLayoutMode();
      };
    }, []);

    const fetchProvidersFn = useCallback(() => args.fetchProviders(), []);

    const fetchAvailabilityFn = useCallback(() => {
      if (!provider)
        throw new Error('No provider selected to fetch availabilities for');

      return new Promise((resolve) =>
        setTimeout(() => {
          console.log(`Fetching availabilities provider ${provider}`);
          return resolve(mockProvidersResponse);
        }, 750)
      );
    }, [provider]);

    const bookAppointmentFn = useCallback(() => {
      if (!slot) throw new Error('No slot was selected');

      return args.onBooking(slot);
    }, []);

    const completeActivity = useCallback(() => {
      return args.onCompleteActivity();
    }, []);

    return (
      <SchedulingActivityComponent
        onProviderSelect={(id) => setProvider(id)}
        onDateSelect={(date) => setDate(date)}
        onSlotSelect={(slot) => setSlot(slot)}
        fetchProviders={fetchProvidersFn}
        onCompleteActivity={completeActivity}
        onBooking={bookAppointmentFn}
        //@ts-expect-error fine for the story
        fetchAvailability={fetchAvailabilityFn}
      />
    );
  },
  args: {}
};
