import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { PhoneQuestion } from './PhoneQuestion';

const meta: Meta<typeof PhoneQuestion> = {
  title: 'Onboarding/PhoneQuestion',
  component: PhoneQuestion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story) => (
      <div className='w-full max-w-2xl p-4'>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof PhoneQuestion>;

// Default - empty
export const Default: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn(),
    consent: false,
    onConsentChange: fn()
  }
};

// With valid phone number
export const WithValidPhone: Story = {
  args: {
    value: '+12025551234',
    onChange: fn(),
    onContinue: fn(),
    consent: false,
    onConsentChange: fn()
  }
};

// With phone and consent (ready to continue)
export const ReadyToContinue: Story = {
  args: {
    value: '+12025551234',
    onChange: fn(),
    onContinue: fn(),
    consent: true,
    onConsentChange: fn()
  }
};

// With invalid phone number
export const InvalidPhone: Story = {
  args: {
    value: '+1202555', // Too short
    onChange: fn(),
    onContinue: fn(),
    consent: true,
    onConsentChange: fn()
  }
};

// With pre-filled state and service (from previous steps)
export const WithContext: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn(),
    state: 'CO',
    service: 'medication',
    consent: false,
    onConsentChange: fn()
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn(),
    consent: false,
    onConsentChange: fn()
  },
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false
    }
  }
};

// Interactive - controlled component
const ControlledPhoneQuestion = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const [consent, setConsent] = React.useState<boolean>(false);
  const [continued, setContinued] = React.useState(false);

  if (continued) {
    return (
      <div className='text-center p-8'>
        <p className='text-lg font-semibold text-green-600'>Phone saved!</p>
        <p className='text-slate-600 mt-2'>Phone: {value}</p>
        <p className='text-slate-600'>Consent: {consent ? 'Yes' : 'No'}</p>
        <button
          onClick={() => {
            setContinued(false);
            setValue(null);
            setConsent(false);
          }}
          className='mt-4 text-sm text-primary underline'
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <PhoneQuestion
      value={value}
      onChange={setValue}
      onContinue={() => setContinued(true)}
      consent={consent}
      onConsentChange={setConsent}
      state='CO'
      service='medication'
    />
  );
};

export const Interactive: Story = {
  render: () => <ControlledPhoneQuestion />
};

// Consent only (phone already filled)
export const ConsentRequired: Story = {
  args: {
    value: '+13035551234',
    onChange: fn(),
    onContinue: fn(),
    consent: false,
    onConsentChange: fn()
  }
};
