import type { Meta, StoryObj } from '@storybook/react';
import { WeekCalendar as WeekCalendarComponent } from './WeekCalendar';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { mockProviderAvailabilityResponse } from '@/lib/api/__mocks__';
import {
  // NoAvailabilitiesSpec,
  NextWeekAvailabilitySpec,
  CurrentWeekAvailabilitySpec
  // WithAvailabilitiesAndInPersonPreferenceSpec
} from './WeekCalendar.spec';
import { EventDeliveryMethod } from '@/lib/api';

const meta: Meta<typeof WeekCalendarComponent> = {
  title: 'Atoms/Calendar/Week',
  component: WeekCalendarComponent,
  parameters: {
    mockingDate: new Date('2024-10-14T18:00:00.000Z')
  },
  args: { onDateSelect: fn() },
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
    loading: true
  }
};

export const NoAvailabilities: Story = {
  args: {
    availabilities: []
  }
};

export const WithAvailabilities: Story = {
  args: {
    availabilities: mockProviderAvailabilityResponse('1717').data['1717']
  }
};

export const TestWithAvailabilitiesAndInPersonPreference: Story = {
  // TODO: Fix this test
  // play: WithAvailabilitiesAndInPersonPreferenceSpec,
  tags: ['prefixing-wip'],
  args: {
    /**
     * Test with two In-Person availabilities on different locations.
     * Should set location filter to the first availability location.
     */
    availabilities: [
      {
        eventId: 't68403en62hji9lad095mv2srk',
        slotstart: new Date('2024-10-15T21:00:00Z'), // Tuesday, same week
        providerId: '1717',
        duration: 60,
        facility: 'NY - Brooklyn Heights',
        location: EventDeliveryMethod.InPerson
      },
      {
        eventId: 't68403en62hji9lad095mv2srk',
        slotstart: new Date('2024-10-16T21:00:00Z'), // Wednesday, same week
        providerId: '1717',
        duration: 60,
        facility: 'NY - Long Island City',
        location: EventDeliveryMethod.InPerson
      },
      {
        eventId: 't68403en62hji9lad095mv2srk',
        slotstart: new Date('2024-10-16T21:30:00Z'), // Wednesday, same week
        providerId: '1717',
        duration: 60,
        facility: 'NY - Long Island City',
        location: EventDeliveryMethod.InPerson
      },
      {
        eventId: 't68403en62hji9lad095mv2srk',
        slotstart: new Date('2024-10-16T21:45:00Z'), // Wednesday, same week
        providerId: '1717',
        duration: 60,
        facility: 'NY - Long Island City',
        location: EventDeliveryMethod.InPerson
      }
    ]
  }
};

export const TestNoAvailabilities: Story = {
  // TODO: Fix this test
  // play: NoAvailabilitiesSpec,
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
