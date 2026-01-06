'use client';

import type { FilterOption } from './types';

interface FilterSectionProps<T extends string> {
  /** Section title */
  title: string;
  /** Available options */
  options: FilterOption<T>[];
  /** Current selected value */
  value: T | undefined;
  /** Callback when value changes */
  onChange: (value: T | undefined) => void;
  /** Unique name for radio group */
  name: string;
  /** Clear value constant */
  clearValue?: string;
  /** Whether this is disabled */
  disabled?: boolean;
}

/**
 * Mobile filter section with radio options.
 */
export function FilterSection<T extends string>({
  title,
  options,
  value,
  onChange,
  name,
  disabled = false,
}: FilterSectionProps<T>) {
  return (
    <div className='space-y-1'>
      <p className='text-sm font-medium text-slate-600'>{title}</p>
      <div className='flex flex-col gap-1'>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 text-sm ${
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } text-slate-700`}
          >
            <input
              type='radio'
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Mobile filter section using Select dropdown.
 */
export function FilterSelectSection<T extends string>({
  title,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  clearValue = '__all',
}: FilterSectionProps<T> & { placeholder?: string }) {
  return (
    <div className='space-y-1'>
      <p className='text-sm font-medium text-slate-600'>{title}</p>
      <select
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === '' || val === clearValue ? undefined : (val as T));
        }}
        disabled={disabled}
        className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50'
      >
        <option value=''>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}



