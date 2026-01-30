import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import { PhoneInput, isValidPhoneNumber, type E164Number } from './phone-input';
import { Label } from './label';

const meta: Meta<typeof PhoneInput> = {
  title: 'UI/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  argTypes: {
    usOnly: {
      control: 'boolean',
      description: 'Restrict to US phone numbers only'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    }
  }
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

// Default phone input
export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>();
    return (
      <PhoneInput
        value={value}
        onChange={setValue}
        placeholder='(555) 123-4567'
      />
    );
  }
};

// With value
export const WithValue: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>(
      '+15551234567' as E164Number
    );
    return <PhoneInput value={value} onChange={setValue} />;
  }
};

// With label
export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>();
    return (
      <div className='flex flex-col gap-2'>
        <Label htmlFor='phone'>Phone number</Label>
        <PhoneInput
          id='phone'
          value={value}
          onChange={setValue}
          placeholder='(555) 123-4567'
        />
      </div>
    );
  }
};

// Disabled state
export const Disabled: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>(
      '+15551234567' as E164Number
    );
    return <PhoneInput value={value} onChange={setValue} disabled />;
  }
};

// With validation feedback
export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>();
    const isValid = value ? isValidPhoneNumber(value) : undefined;

    return (
      <div className='flex flex-col gap-2'>
        <Label htmlFor='phone-validation'>Phone number</Label>
        <PhoneInput
          id='phone-validation'
          value={value}
          onChange={setValue}
          placeholder='(555) 123-4567'
          className={isValid === false ? '[&_input]:border-red-500' : ''}
        />
        {isValid === false && (
          <p className='text-xs text-red-600'>
            Please enter a valid phone number.
          </p>
        )}
        {isValid === true && (
          <p className='text-xs text-green-600'>Valid phone number!</p>
        )}
      </div>
    );
  }
};

// Form example with required
export const FormExample: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>();
    const [submitted, setSubmitted] = React.useState(false);
    const isValid = value ? isValidPhoneNumber(value) : false;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (isValid) {
        alert(`Phone number submitted: ${value}`);
      }
    };

    return (
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-sm'>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='phone-form'>
            Phone number <span className='text-red-500'>*</span>
          </Label>
          <PhoneInput
            id='phone-form'
            value={value}
            onChange={setValue}
            placeholder='(555) 123-4567'
          />
          {submitted && !isValid && (
            <p className='text-xs text-red-600'>
              Please enter a valid phone number.
            </p>
          )}
          <p className='text-xs text-slate-500'>
            We&apos;ll send appointment reminders to this number.
          </p>
        </div>
        <button
          type='submit'
          className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90'
        >
          Submit
        </button>
      </form>
    );
  }
};

// Real-world: Contact form
export const ContactForm: Story = {
  render: () => {
    const [phone, setPhone] = React.useState<E164Number | undefined>();
    const [name, setName] = React.useState('');

    return (
      <div className='flex flex-col gap-4 max-w-sm p-4 border border-slate-200 rounded-lg'>
        <h3 className='text-lg font-semibold'>Contact Information</h3>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='contact-name'>Full name</Label>
          <input
            id='contact-name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='John Doe'
            className='flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base'
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='contact-phone'>Phone number</Label>
          <PhoneInput
            id='contact-phone'
            value={phone}
            onChange={setPhone}
            placeholder='(555) 123-4567'
          />
        </div>
      </div>
    );
  }
};

// Interactive test
export const TypingInteraction: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>();
    return (
      <PhoneInput
        value={value}
        onChange={setValue}
        placeholder='(555) 123-4567'
        data-testid='phone-input'
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    // Type a phone number
    await userEvent.type(input, '5551234567');

    // Verify input has value (formatted)
    await expect(input).not.toHaveValue('');
  }
};

// Display E.164 value
export const ShowsE164Value: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>();

    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Label>Phone number</Label>
          <PhoneInput
            value={value}
            onChange={setValue}
            placeholder='(555) 123-4567'
          />
        </div>
        <div className='p-3 bg-slate-100 rounded-md'>
          <p className='text-xs text-slate-500 mb-1'>
            Stored value (E.164 format):
          </p>
          <code className='text-sm font-mono'>{value || '(empty)'}</code>
        </div>
      </div>
    );
  }
};
