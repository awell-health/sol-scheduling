import type { Meta, StoryObj } from '@storybook/react';
import { FetchingProvidersError as FetchingProviderErrorComponent } from './FetchingProvidersError';
import { ThemeProvider } from '@awell-health/ui-library';

const meta: Meta<typeof FetchingProviderErrorComponent> = {
  title: 'Atoms/FetchingProviderError',
  component: FetchingProviderErrorComponent,
  args: {},
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FetchingProviderError: Story = {
  args: {}
};
