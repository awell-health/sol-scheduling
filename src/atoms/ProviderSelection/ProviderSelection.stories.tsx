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
        <Story />
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
        firstName: 'Nick',
        lastName: 'Hellemans',
        profileImageUrl:
          'https://static.vecteezy.com/system/resources/previews/010/871/290/original/3d-avatar-doctor-png.png',
        firstAvailability: new Date()
      },
      {
        id: '2',
        firstName: 'Rik',
        lastName: 'Renard',
        profileImageUrl:
          'https://static.vecteezy.com/system/resources/previews/010/871/290/original/3d-avatar-doctor-png.png',
        firstAvailability: new Date()
      },
      {
        id: '3',
        firstName: 'Jonathan',
        lastName: 'Belanger',
        profileImageUrl:
          'https://static.vecteezy.com/system/resources/previews/010/871/290/original/3d-avatar-doctor-png.png',
        firstAvailability: new Date()
      }
    ]
  }
};
