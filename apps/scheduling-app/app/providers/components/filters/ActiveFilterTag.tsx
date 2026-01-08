'use client';

import clsx from 'clsx';

interface ActiveFilterTagProps {
  /** Label to display (e.g., "State") */
  label: string;
  /** Selected value display text (e.g., "Washington DC") */
  value: string;
  /** Callback when clear button is clicked */
  onClear: () => void;
}

/**
 * A tag showing an active filter with a clear button.
 * Example: ( State: Washington DC  × )
 */
export function ActiveFilterTag({ label, value, onClear }: ActiveFilterTagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full',
        'border border-secondary bg-secondary/50 px-3 py-1.5',
        'text-sm text-secondary-foreground'
      )}
    >
      <span className='font-medium'>{label}:</span>
      <span>{value}</span>
      <button
        type='button'
        onClick={onClear}
        className='ml-0.5 rounded-full p-0.5 text-secondary-foreground/70 transition hover:bg-secondary hover:text-secondary-foreground'
        aria-label={`Clear ${label} filter`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          className='h-3.5 w-3.5'
        >
          <path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
        </svg>
      </button>
    </span>
  );
}



