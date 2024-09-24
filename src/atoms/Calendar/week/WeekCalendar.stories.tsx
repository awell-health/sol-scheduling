import type { Meta, StoryObj } from '@storybook/react';
import { WeekCalendar as WeekCalendarComponent } from './WeekCalendar';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { SolApiProvider, useSolApi } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse
} from '@/lib/api/__mocks__';
import { PreferencesProvider } from '@/PreferencesProvider';
import { useEffect } from 'react';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof WeekCalendarComponent> = {
  title: 'Atoms/Calendar/Week',
  component: WeekCalendarComponent,
  args: { onSelect: fn() },
  decorators: [
    (Story) => {
      return (
        <ThemeProvider accentColor='#A45128'>
          <SolApiProvider
            fetchAvailability={async (pid) => {
              action('fetchAvailability')(pid);
              return Promise.resolve(mockProviderAvailabilityResponse(pid));
            }}
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
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Week: Story = {
  render: (args) => {
    const {
      availabilities: { fetch: fetchAvailabilities }
    } = useSolApi();

    useEffect(() => {
      fetchAvailabilities('test-provider-id');
    }, []);

    return <WeekCalendarComponent {...args} />;
  },
  args: {
    weekStartsOn: 'monday',
    hideWeekends: true
  }
};
