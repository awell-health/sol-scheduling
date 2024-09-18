import type { Meta, StoryObj } from '@storybook/react';
import { ProviderSelection as ProviderSelectionComponent } from './ProviderSelection';
import { ThemeProvider } from '@awell-health/ui-library';
import { PreferencesProvider } from '@/PreferencesProvider';
import { SolApiProvider } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse
} from '@/lib/api/__mocks__';
import { fn } from '@storybook/test';

const meta: Meta<typeof ProviderSelectionComponent> = {
  title: 'Atoms/ProviderSelection',
  component: ProviderSelectionComponent,
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <SolApiProvider
          fetchAvailability={(pid) =>
            Promise.resolve(mockProviderAvailabilityResponse(pid))
          }
          fetchProviders={mockFetchProvidersFn}
          bookAppointment={fn()}
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

export const ProviderSelection: Story = {
  args: {
    onSelectProvider: (pid) => {
      alert(`you have chosen... wisely. pid=${pid}`);
    }
  }
};
