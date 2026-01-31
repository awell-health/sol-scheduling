import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ProvidersEmptyState } from './ProvidersEmptyState';

const meta: Meta<typeof ProvidersEmptyState> = {
  title: 'Providers/ProvidersEmptyState',
  component: ProvidersEmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof ProvidersEmptyState>;

// Default without reset button
export const Default: Story = {
  args: {}
};

// With reset button
export const WithResetButton: Story = {
  args: {
    onReset: fn()
  }
};

// In context (with container)
export const InContext: Story = {
  render: (args) => (
    <div className='max-w-3xl mx-auto'>
      <h2 className='text-lg font-semibold mb-4'>Available Providers</h2>
      <ProvidersEmptyState {...args} />
    </div>
  ),
  args: {
    onReset: fn()
  }
};
