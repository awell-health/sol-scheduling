import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Calendar } from './calendar';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode'
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Show days from previous/next months'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// Default calendar
export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    return (
      <Calendar mode='single' selected={selected} onSelect={setSelected} />
    );
  }
};

// With pre-selected date
export const WithSelectedDate: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>(
      new Date()
    );
    return (
      <Calendar mode='single' selected={selected} onSelect={setSelected} />
    );
  }
};

// Multiple selection
export const MultipleSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date[] | undefined>([]);
    return (
      <Calendar mode='multiple' selected={selected} onSelect={setSelected} />
    );
  }
};

// Range selection
export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = React.useState<
      { from: Date; to?: Date } | undefined
    >();
    return (
      <Calendar
        mode='range'
        selected={range}
        onSelect={(value) =>
          setRange(value as { from: Date; to?: Date } | undefined)
        }
      />
    );
  }
};

// With disabled dates (weekends)
export const DisabledWeekends: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    const isWeekend = (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };
    return (
      <Calendar
        mode='single'
        selected={selected}
        onSelect={setSelected}
        disabled={isWeekend}
      />
    );
  }
};

// With disabled past dates
export const DisabledPastDates: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      <Calendar
        mode='single'
        selected={selected}
        onSelect={setSelected}
        disabled={{ before: today }}
      />
    );
  }
};

// With specific disabled dates
export const DisabledSpecificDates: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    const today = new Date();
    const disabledDates = [
      new Date(today.getFullYear(), today.getMonth(), 15),
      new Date(today.getFullYear(), today.getMonth(), 20),
      new Date(today.getFullYear(), today.getMonth(), 25)
    ];
    return (
      <div className='space-y-2'>
        <p className='text-sm text-slate-500'>
          15th, 20th, and 25th are unavailable
        </p>
        <Calendar
          mode='single'
          selected={selected}
          onSelect={setSelected}
          disabled={disabledDates}
        />
      </div>
    );
  }
};

// Without outside days
export const NoOutsideDays: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    return (
      <Calendar
        mode='single'
        selected={selected}
        onSelect={setSelected}
        showOutsideDays={false}
      />
    );
  }
};

// Fixed month (no navigation)
export const FixedMonth: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    const currentMonth = new Date();
    return (
      <Calendar
        mode='single'
        selected={selected}
        onSelect={setSelected}
        month={currentMonth}
        disableNavigation
      />
    );
  }
};

// Multiple months
export const TwoMonths: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    return (
      <Calendar
        mode='single'
        selected={selected}
        onSelect={setSelected}
        numberOfMonths={2}
      />
    );
  }
};

// Real-world: Appointment date picker
export const AppointmentPicker: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable weekends and past dates
    const isDisabled = (date: Date) => {
      const day = date.getDay();
      const isPast = date < today;
      const isWeekend = day === 0 || day === 6;
      return isPast || isWeekend;
    };

    return (
      <div className='space-y-4'>
        <div>
          <h3 className='text-sm font-medium text-slate-900'>
            Select appointment date
          </h3>
          <p className='text-xs text-slate-500'>Weekends are not available</p>
        </div>
        <Calendar
          mode='single'
          selected={selected}
          onSelect={setSelected}
          disabled={isDisabled}
        />
        {selected && (
          <p className='text-sm text-slate-700'>
            Selected:{' '}
            {selected.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>
    );
  }
};

// Interactive test
export const NavigationInteraction: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    return (
      <Calendar
        mode='single'
        selected={selected}
        onSelect={setSelected}
        data-testid='calendar'
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the next month button
    const nextButton = canvas
      .getAllByRole('button')
      .find((btn) => btn.querySelector('svg.lucide-chevron-right'));

    if (nextButton) {
      await userEvent.click(nextButton);
    }

    // Verify calendar is still visible
    const calendar = canvas.getByRole('grid');
    await expect(calendar).toBeVisible();
  }
};
