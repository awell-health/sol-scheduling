import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';

import { ThemeProvider } from '@awell-health/ui-library';

import { Scheduler as SchedulerComponent } from './Scheduler';
import { SolApiProvider, useSolApi } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse,
  mockProviderResponse
} from '@/lib/api/__mocks__';
import { PreferencesProvider } from '@/PreferencesProvider';
import { useEffect } from 'react';
import { action } from '@storybook/addon-actions';
import {
  type BookAppointmentResponseType,
  type GetProviderResponseType
} from '@/lib/api';

const meta: Meta<typeof SchedulerComponent> = {
  title: 'Molecules/Scheduler',
  component: SchedulerComponent,
  parameters: {
    mockingDate: new Date('2024-01-01')
  },
  decorators: [
    (Story) => {
      return (
        <ThemeProvider accentColor='#A45128'>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <SolApiProvider
              fetchAvailability={async (pid) => {
                action('fetchAvailability')(pid);
                return Promise.resolve(mockProviderAvailabilityResponse(pid));
              }}
              fetchProvider={async (pid) => {
                action('fetchProvider')(pid);

                const data = (await new Promise((resolve) =>
                  setTimeout(() => resolve(mockProviderResponse), 1500)
                )) as GetProviderResponseType;

                return data;
              }}
              fetchProviders={mockFetchProvidersFn}
              bookAppointment={async (_slot) => {
                action('bookAppointment')(_slot);

                const data = new Promise((resolve) =>
                  setTimeout(() => resolve({ data: [] }), 1500)
                ) as BookAppointmentResponseType;

                return data;
              }}
              completeActivity={async (_slot, _preferences) => {
                action('completeActivity')({
                  slot: _slot,
                  preferences: _preferences
                });
              }}
            >
              <PreferencesProvider initialPreferences={{}}>
                <div style={{ maxWidth: '750px', margin: '0 auto' }}>
                  <Story />
                </div>
              </PreferencesProvider>
            </SolApiProvider>
          </div>
        </ThemeProvider>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Component: Story = {
  render: (args) => {
    const {
      provider: { setId: setProviderId }
    } = useSolApi();

    useEffect(() => {
      setProviderId('test-provider-id');
    }, []);

    return <SchedulerComponent {...args} />;
  }
};

export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    /** Get all elements of interests */
    const cherryCreekButton = await canvas.findByRole('button', {
      name: 'CO - Cherry Creek'
    });
    const unionSquareButton = await canvas.findByRole('button', {
      name: 'NY - Union Square'
    });
    const virtualButton = await canvas.findByRole('button', {
      name: 'Virtual'
    });
    const prevWeekButton = await canvas.findByLabelText('Go to previous week');
    const nextWeekButton = await canvas.findByLabelText('Go to next week');

    // Calendar navigation
    await userEvent.click(prevWeekButton);
    const prevWeekDayCard = await canvas.findByTestId('Mon Dec 25 2023');
    expect(prevWeekDayCard).toBeVisible();
    await userEvent.click(nextWeekButton);

    // Default state (Virtual)
    const mondayCard = await canvas.findByTestId('Mon Jan 01 2024');
    const tuesdayCard = await canvas.findByTestId('Tue Jan 02 2024');

    await within(mondayCard).findByText('2 slots');
    await within(tuesdayCard).findByText('3 slots');

    // Cherry Creek
    await userEvent.click(cherryCreekButton);
    await within(mondayCard).findByText('1 slot');
    await within(tuesdayCard).findByText('1 slot');

    // Union Square
    await userEvent.click(unionSquareButton);
    await within(mondayCard).findByText('No slots');
    await within(tuesdayCard).findByText('1 slot');

    // Go back to virtual and let's test the slots
    await userEvent.click(virtualButton);
    await userEvent.click(mondayCard);
    const slotsContainer = await canvas.findByTestId('slots');
    await expect(slotsContainer.children.length).toBe(2); // Monday has 2 slots
    await userEvent.click(tuesdayCard);
    await expect(slotsContainer.children.length).toBe(3); // Tuesday has 3 slots

    const elevenAmSlot = (await slotsContainer.querySelector(
      '[aria-label="2024-01-02T10:00:00.000Z"]'
    )) as HTMLElement;

    if (elevenAmSlot === null) {
      throw new Error('No 10 AM (UTC) slot found');
    }

    await userEvent.click(elevenAmSlot);

    const bookButton = await canvas.findByRole('button', {
      name: 'Confirm booking'
    });

    expect(bookButton).toBeVisible();
  },
  render: (args) => {
    const {
      provider: { setId: setProviderId }
    } = useSolApi();

    useEffect(() => {
      setProviderId('test-provider-id');
    }, []);

    return <SchedulerComponent {...args} />;
  }
};
