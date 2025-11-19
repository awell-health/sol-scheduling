'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import {
  DayPicker,
  type DayPickerProps
} from 'react-day-picker';
import type {
  PreviousMonthButtonProps,
  NextMonthButtonProps
} from 'react-day-picker';

import 'react-day-picker/dist/style.css';

type ClassValue = string | number | null | false | undefined;

const cn = (...values: ClassValue[]) => clsx(values);

export type CalendarProps = DayPickerProps;

export const Calendar: React.FC<CalendarProps> = ({
  className,
  components,
  showOutsideDays = true,
  ...props
}) => {
  const rootClassName = cn('p-3', className);

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
      components={{
        PreviousMonthButton: (props) => <PreviousButton {...props} />,
        NextMonthButton: (props) => <NextButton {...props} />,
        ...components
      }}
      {...props}
    />
  );
};

