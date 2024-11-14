import type { Meta, StoryObj } from '@storybook/react';
import { WeekCalendar as WeekCalendarComponent } from './WeekCalendar';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { mockProviderAvailabilityResponse } from '@/lib/api/__mocks__';
import {
  NoAvailabilitiesSpec,
  NextWeekAvailabilitySpec,
  CurrentWeekAvailabilitySpec
} from './WeekCalendar.spec';
import { EventDeliveryMethod } from '@/lib/api';

const meta: Meta<typeof WeekCalendarComponent> = {
  title: 'Atoms/Calendar/Week',
  component: WeekCalendarComponent,
  parameters: {
    mockingDate: new Date('2024-10-14T18:00:00.000Z')
  },
  args: { onDateSelect: fn(), onLocationSelect: fn() },
  decorators: [
    (Story) => {
      return (
        <ThemeProvider accentColor='#A45128'>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    availabilities: [],
    loading: true,
    weekStartsOn: 'monday',
    hideWeekends: true
  }
};

export const NoAvailabilities: Story = {
  args: {
    availabilities: [],
    weekStartsOn: 'monday',
    hideWeekends: true
  }
};

export const WithAvailabilities: Story = {
  args: {
    availabilities: mockProviderAvailabilityResponse('1717').data['1717'],
    weekStartsOn: 'monday',
    hideWeekends: true
  }
};

export const TestNoAvailabilities: Story = {
  play: NoAvailabilitiesSpec,
  render: (args) => {
    const noAvailArgs = {
      ...args,
      availabilities: [],
      weekStartsOn: 'monday' as const,
      hideWeekends: true
    };
    return <WeekCalendarComponent {...noAvailArgs} />;
  }
};

export const TestCurrentWeekAvailability: Story = {
  play: CurrentWeekAvailabilitySpec,
  render: (args) => {
    // Current date is mocked to be 2024-10-14 (Monday)
    const scrollToAvailabilitiesArgs = {
      ...args,
      availabilities: [
        {
          eventId: 't68403en62hji9lad095mv2srk',
          slotstart: new Date('2024-10-15T21:00:00Z'), // Tuesday, same week
          providerId: '1717',
          duration: 60,
          facility: 'NY - Brooklyn Heights',
          location: EventDeliveryMethod.Telehealth
        },
        {
          eventId: 't68403en62hji9lad095mv2srk',
          slotstart: new Date('2024-10-22T21:00:00Z'), // Tuesday, next week
          providerId: '1717',
          duration: 60,
          facility: 'NY - Brooklyn Heights',
          location: EventDeliveryMethod.Telehealth
        }
      ],
      weekStartsOn: 'monday' as const,
      hideWeekends: true
    };
    return <WeekCalendarComponent {...scrollToAvailabilitiesArgs} />;
  }
};

export const TestNextWeekAvailability: Story = {
  play: NextWeekAvailabilitySpec,
  render: (args) => {
    // Current date is mocked to be 2024-10-14 (Monday)
    const scrollToAvailabilitiesArgs = {
      ...args,
      availabilities: [
        {
          eventId: 't68403en62hji9lad095mv2srk',
          slotstart: new Date('2024-10-21T21:00:00Z'), // Monday one week later
          providerId: '1717',
          duration: 60,
          facility: 'NY - Brooklyn Heights',
          location: EventDeliveryMethod.Telehealth
        },
        {
          eventId: 't68403en62hji9lad095mv2srk',
          slotstart: new Date('2024-10-28T21:00:00Z'), // Monday two weeks later
          providerId: '1717',
          duration: 60,
          facility: 'NY - Brooklyn Heights',
          location: EventDeliveryMethod.Telehealth
        }
      ],
      weekStartsOn: 'monday' as const,
      hideWeekends: true
    };
    return <WeekCalendarComponent {...scrollToAvailabilitiesArgs} />;
  }
};
