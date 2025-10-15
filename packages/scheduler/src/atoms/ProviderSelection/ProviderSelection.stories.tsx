import type { Meta, StoryObj } from '@storybook/react';
import { ProviderSelection as ProviderSelectionComponent } from './ProviderSelection';
import { ThemeProvider } from '@awell-health/ui-library';
import { PreferencesProvider } from '@/PreferencesProvider';
import { SolApiProvider, useSolApi } from '@/SolApiProvider';
import {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse
} from '@/lib/api/__mocks__';
import { fn } from '@storybook/test';
import { useEffect } from 'react';
import { ProviderSelectionSpec } from './ProviderSelection.spec';

const meta: Meta<typeof ProviderSelectionComponent> = {
  title: 'Atoms/ProviderSelection',
  component: ProviderSelectionComponent,
  parameters: {
    mockingDate: new Date()
  },
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <SolApiProvider
          fetchAvailability={(pid) =>
            Promise.resolve(mockProviderAvailabilityResponse(pid))
          }
          fetchProvider={fn()}
          fetchProviders={mockFetchProvidersFn}
          bookAppointment={fn()}
          completeActivity={fn()}
        >
          <PreferencesProvider initialPreferences={{}}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
    onSelectProvider: (pid: string | number) => {
      alert(`you have chosen... wisely. pid=${pid}`);
    }
  }
};
export const ProviderFilterTest: Story = {
  args: {
    onSelectProvider: (pid: string | number) => {
      alert(`you have chosen... wisely. pid=${pid}`);
    }
  },
  play: ProviderSelectionSpec,
  render: (args: any) => {
    const {
      provider: { setId: setProviderId }
    } = useSolApi();

    useEffect(() => {
      setProviderId('test-provider-id');
    }, []);

    return <ProviderSelectionComponent {...args} />;
  }
};
