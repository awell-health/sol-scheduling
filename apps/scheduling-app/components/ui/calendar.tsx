'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import type {
  PreviousMonthButtonProps,
  NextMonthButtonProps
} from 'react-day-picker';

import 'react-day-picker/dist/style.css';

type ClassValue = string | number | null | false | undefined;

const cn = (...values: ClassValue[]) => clsx(values);

/**
 * Default modifier class names for the design system.
 * These can be overridden by passing modifiersClassNames prop.
 */
const defaultModifiersClassNames = {
  // Single selection
  selected:
    'bg-secondary text-secondary-foreground rounded-md !ring-0 !border-0 !outline-none',
  today: 'ring-1 ring-secondary text-secondary-foreground rounded-md',
  disabled: 'text-slate-300 cursor-not-allowed',
  // Range selection
  range_start:
    'bg-secondary text-secondary-foreground rounded-l-md rounded-r-none !ring-0 !border-0 !outline-none',
  range_end:
    'bg-secondary text-secondary-foreground rounded-r-md rounded-l-none !ring-0 !border-0 !outline-none',
  range_middle: 'bg-secondary/50 text-secondary-foreground !rounded-none'
};

export type CalendarProps = DayPickerProps;

export const Calendar: React.FC<CalendarProps> = ({
  className,
  components,
  modifiersClassNames,
  showOutsideDays = true,
  ...props
}) => {
  const rootClassName = cn('p-3', className);

  // Merge default modifier classes with any overrides
  const mergedModifiersClassNames = {
    ...defaultModifiersClassNames,
    ...modifiersClassNames
  };

  const PreviousButton: React.FC<PreviousMonthButtonProps> = (buttonProps) => (
    <button
      {...buttonProps}
      type='button'
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50',
        buttonProps.className
      )}
    >
      <ChevronLeft className='h-4 w-4' />
    </button>
  );

  const NextButton: React.FC<NextMonthButtonProps> = (buttonProps) => (
    <button
      {...buttonProps}
      type='button'
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50',
        buttonProps.className
      )}
    >
      <ChevronRight className='h-4 w-4' />
    </button>
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={rootClassName}
      modifiersClassNames={mergedModifiersClassNames}
      components={{
        PreviousMonthButton: (props) => <PreviousButton {...props} />,
        NextMonthButton: (props) => <NextButton {...props} />,
        ...components
      }}
      {...props}
    />
  );
};
