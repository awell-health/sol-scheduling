import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Input>;

// Default input
export const Default: Story = {
  args: {
    placeholder: 'Enter text...'
  }
};

// With value
export const WithValue: Story = {
  args: {
    defaultValue: 'Hello, World!'
  }
};

// Input types
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com'
  }
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password'
  }
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0'
  }
};

// States
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true
  }
};

export const DisabledWithValue: Story = {
  args: {
    defaultValue: 'Cannot edit this',
    disabled: true
  }
};

// With label
export const WithLabel: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Label htmlFor='email'>Email address</Label>
      <Input id='email' type='email' placeholder='you@example.com' />
    </div>
  )
};

// Form field example
export const FormField: Story = {
  render: () => (
    <div className='flex flex-col gap-1.5'>
      <Label htmlFor='name'>Full name</Label>
      <Input id='name' placeholder='John Doe' />
      <p className='text-xs text-slate-500'>
        Enter your legal name as it appears on your ID.
      </p>
    </div>
  )
};

// Error state (visual only - no built-in error state)
export const WithError: Story = {
  render: () => (
    <div className='flex flex-col gap-1.5'>
      <Label htmlFor='email-error'>Email address</Label>
      <Input
        id='email-error'
        type='email'
        placeholder='you@example.com'
        defaultValue='invalid-email'
        className='border-red-500 focus-visible:ring-red-500/20'
      />
      <p className='text-xs text-red-600'>
        Please enter a valid email address.
      </p>
    </div>
  )
};

// Interactive tests
export const TypingInteraction: Story = {
  args: {
    placeholder: 'Type something...'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Type something...');

    await userEvent.type(input, 'Hello, Storybook!');
    await expect(input).toHaveValue('Hello, Storybook!');
  }
};

export const FocusInteraction: Story = {
  args: {
    placeholder: 'Click to focus'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Click to focus');

    await userEvent.click(input);
    await expect(input).toHaveFocus();
  }
};

export const ClearAndType: Story = {
  args: {
    defaultValue: 'Initial value'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByDisplayValue('Initial value');

    await userEvent.clear(input);
    await userEvent.type(input, 'New value');
    await expect(input).toHaveValue('New value');
  }
};
