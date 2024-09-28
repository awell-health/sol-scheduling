import type { Meta, StoryObj } from '@storybook/react';
import { DayCard as DayCardComponent } from './DayCard';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';

const meta: Meta<typeof DayCardComponent> = {
  title: 'Atoms/Calendar/Week/DayCard',
  component: DayCardComponent,
  args: { onSelect: fn() },
  decorators: [
    (Story) => {
      return (
        <ThemeProvider accentColor='#A45128'>
          <Story />
        </ThemeProvider>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    day: {
      date: new Date('2024-01-01'),
      isToday: true,
      isSelected: false,
      isDisabled: false,
      availabilitiesCount: 2
    }
  }
};

export const Selected: Story = {
  args: {
    day: {
      date: new Date('2024-01-01'),
      isToday: true,
      isSelected: true,
      isDisabled: false,
      availabilitiesCount: 2
    }
  }
};

export const DisabledWithAvailability: Story = {
  args: {
    day: {
      date: new Date('2024-01-01'),
      isToday: true,
      isSelected: false,
      isDisabled: true,
      availabilitiesCount: 2
    }
  }
};

export const DisabledWithoutAvailability: Story = {
  args: {
    day: {
      date: new Date('2024-01-01'),
      isToday: true,
      isSelected: false,
      isDisabled: true,
      availabilitiesCount: 0
    }
  }
};

export const NoAvailability: Story = {
  args: {
    day: {
      date: new Date('2024-01-01'),
      isToday: true,
      isSelected: false,
      isDisabled: false,
      availabilitiesCount: 0
    }
  }
};
