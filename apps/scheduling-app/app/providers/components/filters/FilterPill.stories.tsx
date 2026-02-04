import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, userEvent, expect } from 'storybook/test';
import { FilterPill } from './FilterPill';
import type { FilterOption } from './types';

// Sample options for stories
const stateOptions: FilterOption<string>[] = [
  { label: 'Colorado', value: 'CO' },
  { label: 'New York', value: 'NY' },
  { label: 'Virginia', value: 'VA' },
  { label: 'California', value: 'CA' },
  { label: 'Texas', value: 'TX' }
];

const serviceOptions: FilterOption<string>[] = [
  { label: 'Medication Management', value: 'medication' },
  { label: 'Therapy', value: 'therapy' },
  { label: 'Both', value: 'both' }
];

const meta: Meta<typeof FilterPill> = {
  title: 'Providers/Filters/FilterPill',
  component: FilterPill,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <div className='min-h-[350px] p-4'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dropdown is open'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the filter is disabled'
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether the filter is submitting'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FilterPill>;

// Default closed state
export const Default: Story = {
  args: {
    filterKey: 'state',
    label: 'State',
    options: stateOptions,
    value: undefined,
    isOpen: false,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// With selected value
export const WithValue: Story = {
  args: {
    filterKey: 'state',
    label: 'State',
    options: stateOptions,
    value: 'CO',
    isOpen: false,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// Open dropdown
export const Open: Story = {
  args: {
    filterKey: 'state',
    label: 'State',
    options: stateOptions,
    value: undefined,
    isOpen: true,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// Open with selection
export const OpenWithSelection: Story = {
  args: {
    filterKey: 'state',
    label: 'State',
    options: stateOptions,
    value: 'NY',
    isOpen: true,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// Disabled state
export const Disabled: Story = {
  args: {
    filterKey: 'facility',
    label: 'Facility',
    options: [],
    value: undefined,
    isOpen: false,
    disabled: true,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// Submitting state
export const Submitting: Story = {
  args: {
    filterKey: 'state',
    label: 'State',
    options: stateOptions,
    value: undefined,
    isOpen: true,
    isSubmitting: true,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// Service filter example
export const ServiceFilter: Story = {
  args: {
    filterKey: 'service',
    label: 'Service',
    options: serviceOptions,
    value: undefined,
    isOpen: true,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// Not clearable
export const NotClearable: Story = {
  args: {
    filterKey: 'service',
    label: 'Service',
    options: serviceOptions,
    value: 'therapy',
    isOpen: true,
    clearable: false,
    onApply: fn(),
    onToggle: fn(),
    onClose: fn()
  }
};

// Interactive - Controlled component wrapper
const ControlledFilterPill = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | undefined>();

  return (
    <FilterPill
      filterKey='state'
      label='State'
      options={stateOptions}
      value={value}
      isOpen={isOpen}
      onApply={(val) => {
        setValue(val);
        setIsOpen(false);
      }}
      onToggle={() => setIsOpen(!isOpen)}
      onClose={() => setIsOpen(false)}
    />
  );
};

export const Interactive: Story = {
  render: () => <ControlledFilterPill />
};

// Multiple filters in a row (like the actual filter bar)
const FilterBar = () => {
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [values, setValues] = React.useState<
    Record<string, string | undefined>
  >({});

  const filters = [
    { key: 'state', label: 'State', options: stateOptions },
    { key: 'service', label: 'Service', options: serviceOptions }
  ];

  return (
    <div className='flex gap-2'>
      {filters.map((filter) => (
        <FilterPill
          key={filter.key}
          filterKey={filter.key}
          label={filter.label}
          options={filter.options}
          value={values[filter.key]}
          isOpen={activeFilter === filter.key}
          onApply={(val) => {
            setValues({ ...values, [filter.key]: val });
            setActiveFilter(null);
          }}
          onToggle={() =>
            setActiveFilter(activeFilter === filter.key ? null : filter.key)
          }
          onClose={() => setActiveFilter(null)}
        />
      ))}
    </div>
  );
};

export const FilterBarExample: Story = {
  render: () => <FilterBar />
};
