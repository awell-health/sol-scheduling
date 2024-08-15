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
    onProviderSelect: fn(),
    onDateSelect: fn(),
    onSlotSelect: fn(),
    onCompleteActivity: fn(),
    fetchProviders: () => {
      console.log('Fetching providers');
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockProvidersResponse), 750)
      );
    },
    fetchAvailability: (providerId: string) => {
      console.log('Fetching availability for provider', providerId);
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockProviderAvailabilityResponse), 750)
      );
    },
    onBooking: fn((slot: SlotType) => {
      console.log('Booking slot', slot);
      return new Promise((resolve) =>
        setTimeout(() => resolve({ data: [] }), 1500)
      );
    })
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

/**
 * Story resembles the implemntation in Hosted Pages
 */
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

    const fetchAvailabilityFn = useCallback(
      (_providerId: string) => args.fetchAvailability(_providerId),
      []
    );

    const bookAppointmentFn = useCallback((_slot: SlotType) => {
      return args.onBooking(_slot);
    }, []);

    const completeActivity = useCallback(() => {
      console.log('Complete activity', {
        provider,
        date,
        slot
      });
      return args.onCompleteActivity();
    }, [slot, provider, date]);

    return (
      <SchedulingActivityComponent
        onProviderSelect={(id) => {
          setProvider(id);
          args.onProviderSelect(id);
        }}
        onDateSelect={(date) => {
          setDate(date);
          args.onDateSelect(date);
        }}
        onSlotSelect={(slot) => {
          setSlot(slot);
          args.onSlotSelect(slot);
        }}
        fetchProviders={fetchProvidersFn}
        onCompleteActivity={completeActivity}
        onBooking={bookAppointmentFn}
        fetchAvailability={fetchAvailabilityFn}
      />
    );
  },
  args: {
    opts: {
      allowSchedulingInThePast: false
    }
  }
};
