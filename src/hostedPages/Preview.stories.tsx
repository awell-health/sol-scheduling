import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@awell-health/ui-library';
import { Preview as PreviewComponent } from './Preview';
import { fn } from '@storybook/test';

const meta: Meta = {
  title: 'HostedPages/Preview',
  component: PreviewComponent,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    onProviderSelect: fn(),
    onDateSelect: fn(),
    onSlotSelect: fn(),
    onBooking: fn(),
    onCompleteActivity: fn()
  },
  decorators: [
    (StoryComponent) => (
      <ThemeProvider accentColor='#A45128'>
        <StoryComponent />
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Preview: Story = {
  args: {}
};
