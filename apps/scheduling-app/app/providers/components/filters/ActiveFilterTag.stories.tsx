import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, userEvent, expect } from 'storybook/test';
import { ActiveFilterTag } from './ActiveFilterTag';

const meta: Meta<typeof ActiveFilterTag> = {
  title: 'Providers/Filters/ActiveFilterTag',
  component: ActiveFilterTag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof ActiveFilterTag>;

// Default
export const Default: Story = {
  args: {
    label: 'State',
    value: 'Colorado',
    onClear: fn()
  }
};

// Service filter
export const ServiceFilter: Story = {
  args: {
    label: 'Service',
    value: 'Medication Management',
    onClear: fn()
  }
};

// Multiple selected (for array filters)
export const MultipleSelected: Story = {
  args: {
    label: 'Clinical Focus',
    value: '3 selected',
    onClear: fn()
  }
};

// Short value
export const ShortValue: Story = {
  args: {
    label: 'Gender',
    value: 'Male',
    onClear: fn()
  }
};

// Long value
export const LongValue: Story = {
  args: {
    label: 'Insurance',
    value: 'Blue Cross Blue Shield of Colorado',
    onClear: fn()
  }
};

// Multiple tags (simulating active filters row)
export const MultipleTags: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <ActiveFilterTag label='State' value='Colorado' onClear={fn()} />
      <ActiveFilterTag label='Service' value='Therapy' onClear={fn()} />
      <ActiveFilterTag label='Time of Day' value='Morning' onClear={fn()} />
      <ActiveFilterTag label='Gender' value='Female' onClear={fn()} />
    </div>
  )
};

// Interactive test - clear button
export const ClearInteraction: Story = {
  args: {
    label: 'State',
    value: 'Colorado',
    onClear: fn()
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const clearButton = canvas.getByRole('button', {
      name: /clear state filter/i
    });

    await userEvent.click(clearButton);
    await expect(args.onClear).toHaveBeenCalled();
  }
};
