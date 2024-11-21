import type { Meta, StoryObj } from '@storybook/react';
import { AvailabilitySlot as SlotComponent } from './AvailabilitySlot';
import { ThemeProvider } from '@awell-health/ui-library';

const meta: Meta<typeof SlotComponent> = {
  title: 'Atoms/AvailabilitySlot',
  component: SlotComponent,
  args: {},
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

export const AvailabilitySlot: Story = {
  args: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    slotstart: new Date('2024-07-12 00:00:00 +0200')
  }
};
