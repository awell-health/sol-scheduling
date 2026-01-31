import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, userEvent, expect } from 'storybook/test';
import { StateQuestion } from './StateQuestion';

const meta: Meta<typeof StateQuestion> = {
  title: 'Onboarding/StateQuestion',
  component: StateQuestion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story) => (
      <div className='w-full max-w-2xl p-4 min-h-[500px]'>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof StateQuestion>;

// Default - no selection
export const Default: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn()
  }
};

// With Colorado selected
export const ColoradoSelected: Story = {
  args: {
    value: 'CO',
    onChange: fn(),
    onContinue: fn()
  }
};

// With New York selected
export const NewYorkSelected: Story = {
  args: {
    value: 'NY',
    onChange: fn(),
    onContinue: fn()
  }
};

// With non-supported state (shows state but still allows selection)
export const NonSupportedState: Story = {
  args: {
    value: 'CA',
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
const ControlledStateQuestion = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const [continued, setContinued] = React.useState(false);

  if (continued) {
    return (
      <div className='text-center p-8'>
        <p className='text-lg font-semibold text-green-600'>State selected!</p>
        <p className='text-slate-600 mt-2'>Selected state: {value}</p>
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
    <StateQuestion
      value={value}
      onChange={setValue}
      onContinue={() => setContinued(true)}
    />
  );
};

export const Interactive: Story = {
  render: () => <ControlledStateQuestion />
};

// With geolocation error simulation
export const WithLocationError: Story = {
  render: () => {
    // This story shows what happens after a failed geolocation attempt
    // In real usage, the error would appear after clicking "Use my location"
    return (
      <div className='w-full max-w-2xl space-y-6'>
        <div>
          <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
            Where are you located?
          </h2>
          <p className='mt-2 text-sm text-slate-700 md:mt-3 md:text-lg'>
            This helps us show providers in your area.
          </p>
        </div>
        <div className='space-y-4'>
          <div className='h-14 w-full rounded-lg border border-slate-300 bg-white px-3 flex items-center text-slate-400'>
            Select your state
          </div>
          <div className='flex items-center gap-3'>
            <div className='h-px flex-1 bg-slate-200' />
            <span className='text-xs text-slate-500'>or</span>
            <div className='h-px flex-1 bg-slate-200' />
          </div>
          <button
            type='button'
            className='inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm'
          >
            Use my location
          </button>
          <p className='text-center text-sm text-amber-700'>
            Unable to detect your location. Please select your state manually.
          </p>
        </div>
      </div>
    );
  }
};
