import type { Meta, StoryObj } from '@storybook/react';
import { WeekCalendar as WeekCalendarComponent } from './WeekCalendar';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { mockProviderAvailabilityResponse } from '@/lib/api/__mocks__';

const meta: Meta<typeof WeekCalendarComponent> = {
  title: 'Atoms/Calendar/Week',
  component: WeekCalendarComponent,
  args: { onDateSelect: fn(), onLocationSelect: fn() },
  parameters: {
    chromatic: { delay: 10000 }
  },
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
    availabilities: mockProviderAvailabilityResponse('123').data['123'],
    weekStartsOn: 'monday',
    hideWeekends: true
  }
};
