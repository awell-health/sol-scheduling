import type { Meta, StoryObj } from '@storybook/react';
import { ProviderAvatar as ProviderAvatarComponent } from './ProviderAvatar';
import { ThemeProvider } from '@awell-health/ui-library';

const meta: Meta<typeof ProviderAvatarComponent> = {
  title: 'Atoms/ProviderAvatar',
  component: ProviderAvatarComponent,
  args: {
    classes: 'w-24 h-24'
  },
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

export const Loading: Story = {
  args: {
    loading: true
  }
};

export const WithImage: Story = {
  args: {
    image: 'profile-image.jpg'
  }
};

export const WithNoImage: Story = {
  args: {
    name: 'Nick Hellemans'
  }
};
