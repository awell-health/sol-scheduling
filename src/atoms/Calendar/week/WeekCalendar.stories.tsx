import type { Meta, StoryObj } from '@storybook/react';
import { WeekCalendar as WeekCalendarComponent } from './WeekCalendar';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { mockProviderAvailabilityResponse } from '@/lib/api/__mocks__';
import { NoAvailabilitiesSpec } from './WeekCalendar.spec';

const meta: Meta<typeof WeekCalendarComponent> = {
  title: 'Atoms/Calendar/Week',
  component: WeekCalendarComponent,
  parameters: {
    mockingDate: new Date('2024-09-01T18:00:00.000Z')
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
