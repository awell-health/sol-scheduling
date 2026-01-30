import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './label';
import { Input } from './input';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'ID of the form element this label is for'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Label>;

// Default label
export const Default: Story = {
  args: {
    children: 'Email address'
  }
};

// With associated input
export const WithInput: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Label htmlFor='email'>Email address</Label>
      <Input id='email' type='email' placeholder='you@example.com' />
    </div>
  )
};

// Required field
export const Required: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Label htmlFor='name'>
        Full name <span className='text-red-500'>*</span>
      </Label>
      <Input id='name' required placeholder='John Doe' />
    </div>
  )
};

// With helper text
export const WithHelperText: Story = {
  render: () => (
    <div className='flex flex-col gap-1.5'>
      <Label htmlFor='phone'>Phone number</Label>
      <Input id='phone' type='tel' placeholder='(555) 123-4567' />
      <p className='text-xs text-slate-500'>
        We&apos;ll only use this for appointment reminders.
      </p>
    </div>
  )
};

// Multiple labels in a form
export const FormExample: Story = {
  render: () => (
    <form className='flex flex-col gap-4 max-w-sm'>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='first-name'>First name</Label>
        <Input id='first-name' placeholder='John' />
      </div>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='last-name'>Last name</Label>
        <Input id='last-name' placeholder='Doe' />
      </div>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='form-email'>Email</Label>
        <Input id='form-email' type='email' placeholder='john@example.com' />
      </div>
    </form>
  )
};

// Custom styled label
export const CustomStyled: Story = {
  args: {
    children: 'Custom Label',
    className: 'text-lg font-bold text-primary'
  }
};
