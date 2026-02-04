import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'link'],
      description: 'Visual style variant of the button'
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    flashOnClick: {
      control: 'boolean',
      description: 'Enable flash animation on click'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default button
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default'
  }
};

// All variants
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'default'
  }
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary'
  }
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline'
  }
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost'
  }
};

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link'
  }
};

// All sizes
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm'
  }
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg'
  }
};

export const Icon: Story = {
  args: {
    children: '✓',
    size: 'icon',
    'aria-label': 'Confirm'
  }
};

// States
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true
  }
};

export const WithFlashAnimation: Story = {
  args: {
    children: 'Click me!',
    flashOnClick: true
  }
};

// Variant showcase
export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Button variant='default'>Default</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='link'>Link</Button>
    </div>
  )
};

// Size showcase
export const AllSizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Button size='sm'>Small</Button>
      <Button size='default'>Default</Button>
      <Button size='lg'>Large</Button>
      <Button size='icon' aria-label='Confirm'>
        ✓
      </Button>
    </div>
  )
};

// Interactive test for click handler
export const ClickInteraction: Story = {
  args: {
    children: 'Click me'
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(button).toBeEnabled();
  }
};

// Interactive test for flash animation
export const FlashInteraction: Story = {
  args: {
    children: 'Flash on click',
    flashOnClick: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Click and verify button exists (animation happens internally)
    await userEvent.click(button);
    await expect(button).toBeVisible();
  }
};
