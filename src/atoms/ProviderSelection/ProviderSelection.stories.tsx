import type { Meta, StoryObj } from '@storybook/react';
import { ProviderSelection as ProviderSelectionComponent } from './ProviderSelection';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';

const meta: Meta<typeof ProviderSelectionComponent> = {
  title: 'Atoms/ProviderSelection',
  component: ProviderSelectionComponent,
  args: { onSelect: fn() },
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

export const ProviderSelection: Story = {
  args: {
    providers: [
      {
        id: '1',
        name: 'Nick Hellemans',
        gender: 'F',
        ethnicity: 'Arab',
        language: 'ar',
        therapeuticModality: 'Psychiatry',
        clinicalFocus: ['Panic disorder', 'stress'],
        deliveryMethod: 'Virtual'
      },
      {
        id: '2',
        name: 'Rik Renard',
        gender: 'M',
        ethnicity: 'Arab',
        language: 'ar',
        therapeuticModality: 'Psychiatry',
        clinicalFocus: ['Panic disorder', 'stress'],
        deliveryMethod: 'Virtual'
      },
      {
        id: '3',
        name: 'Jonathan Belanger',
        gender: 'F',
        ethnicity: 'Arab',
        language: 'ar',
        therapeuticModality: 'Psychiatry',
        clinicalFocus: ['Panic disorder', 'stress'],
        deliveryMethod: 'Virtual'
      }
    ]
  }
};
