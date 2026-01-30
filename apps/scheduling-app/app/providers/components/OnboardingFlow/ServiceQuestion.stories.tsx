import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, userEvent, expect } from 'storybook/test';
import { ServiceQuestion } from './ServiceQuestion';

const meta: Meta<typeof ServiceQuestion> = {
  title: 'Onboarding/ServiceQuestion',
  component: ServiceQuestion,
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
type Story = StoryObj<typeof ServiceQuestion>;

// Default - no selection
export const Default: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn()
  }
};

// With medication/psychiatry selected
export const MedicationSelected: Story = {
  args: {
    value: 'Psychiatric',
    onChange: fn(),
    onContinue: fn()
  }
};

// With therapy selected
export const TherapySelected: Story = {
  args: {
    value: 'Therapy',
    onChange: fn(),
    onContinue: fn()
  }
};

// With both selected
export const BothSelected: Story = {
  args: {
    value: 'Both',
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
const ControlledServiceQuestion = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const [continued, setContinued] = React.useState(false);

  if (continued) {
    return (
      <div className='text-center p-8'>
        <p className='text-lg font-semibold text-green-600'>
          Selection complete!
        </p>
        <p className='text-slate-600 mt-2'>Selected service: {value}</p>
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
    <ServiceQuestion
      value={value}
      onChange={setValue}
      onContinue={() => setContinued(true)}
    />
  );
};

export const Interactive: Story = {
  render: () => <ControlledServiceQuestion />
};

// Selection interaction test
export const SelectionInteraction: Story = {
  args: {
    value: null,
    onChange: fn(),
    onContinue: fn()
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find and click the therapy radio button by its exact label
    const therapyRadio = canvas.getByRole('radio', { name: /^Therapy$/i });
    await userEvent.click(therapyRadio);
    await expect(args.onChange).toHaveBeenCalledWith('Therapy');
  }
};
