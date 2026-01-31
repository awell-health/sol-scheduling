import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { InsuranceQuestion } from './InsuranceQuestion';
import { OnboardingProvider } from '../../_lib/onboarding/OnboardingContext';

// Wrapper to provide necessary context
const WithOnboardingContext = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

const meta: Meta<typeof InsuranceQuestion> = {
  title: 'Onboarding/InsuranceQuestion',
  component: InsuranceQuestion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story) => (
      <WithOnboardingContext>
        <div className='w-full max-w-2xl p-4 min-h-[400px]'>
          <Story />
        </div>
      </WithOnboardingContext>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof InsuranceQuestion>;

// Default - empty
export const Default: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn()
  }
};

// With insurance selected
export const WithSelection: Story = {
  args: {
    value: 'bcbs',
    onChange: fn(),
    onContinue: fn()
  }
};

// With self-pay selected
export const SelfPay: Story = {
  args: {
    value: 'self_pay',
    onChange: fn(),
    onContinue: fn()
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn()
  },
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false
    }
  }
};

// Interactive - controlled component
const ControlledInsuranceQuestion = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const [continued, setContinued] = React.useState(false);

  if (continued) {
    return (
      <div className='text-center p-8'>
        <p className='text-lg font-semibold text-green-600'>Insurance saved!</p>
        <p className='text-slate-600 mt-2'>Selected: {value}</p>
        <button
          onClick={() => {
            setContinued(false);
            setValue(null);
          }}
          className='mt-4 text-sm text-primary underline'
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <InsuranceQuestion
      value={value}
      onChange={setValue}
      onContinue={() => setContinued(true)}
    />
  );
};

export const Interactive: Story = {
  render: () => <ControlledInsuranceQuestion />
};

// Simulating search with no results
export const NoSearchResults: Story = {
  render: () => (
    <div className='w-full max-w-2xl space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
          Who is your insurance provider?
        </h2>
        <p className='mt-2 text-sm text-slate-700 md:mt-3 md:text-lg'>
          This helps us verify your coverage and find in-network providers.
        </p>
      </div>
      <div className='space-y-3'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search insurance carriers…'
            defaultValue='XYZ Insurance'
            className='flex h-14 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base'
          />
          <div className='absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg'>
            No insurance carriers match your search.
          </div>
        </div>
        <p className='text-center text-xs text-slate-500'>
          Don&apos;t see your insurance? Select &quot;Other&quot; and we&apos;ll
          help you figure it out.
        </p>
      </div>
    </div>
  )
};
