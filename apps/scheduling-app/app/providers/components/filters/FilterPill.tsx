'use client';

import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import type { FilterOption } from './types';

interface FilterPillProps<T extends string> {
  /** Unique filter key */
  filterKey: string;
  /** Display label when no value selected */
  label: string;
  /** Available options */
  options: FilterOption<T>[];
  /** Current applied value */
  value: T | undefined;
  /** Callback when value is applied (handles update + submit) */
  onApply: (value: T | undefined) => void;
  /** Whether dropdown is open */
  isOpen: boolean;
  /** Callback to toggle dropdown */
  onToggle: () => void;
  /** Callback to close dropdown */
  onClose: () => void;
  /** Whether filter is disabled */
  disabled?: boolean;
  /** Whether to show clear button */
  clearable?: boolean;
  /** Whether apply is in progress */
  isSubmitting?: boolean;
  /** Values that should be rendered as disabled/greyed-out in the dropdown */
  disabledValues?: T[];
}

const basePillClasses =
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0';

/**
 * Desktop filter pill with dropdown.
 * Maintains local draft state - only calls onApply when Apply is clicked.
 */
export function FilterPill<T extends string>({
  filterKey,
  label,
  options,
  value,
  onApply,
  isOpen,
  onToggle,
  onClose,
  disabled = false,
  clearable = true,
  isSubmitting = false,
  disabledValues,
}: FilterPillProps<T>) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Local draft state - only synced to parent on Apply
  const [draftValue, setDraftValue] = useState<T | undefined>(value);

  // Sync draft with applied value when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setDraftValue(value);
    }
  }, [isOpen, value]);

  const hasValue = value !== undefined;

  // Close on click outside (cancels draft changes)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleClear = () => {
    onApply(undefined);
    onClose();
  };

  const handleApply = () => {
    onApply(draftValue);
    onClose();
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        disabled={disabled}
        onClick={onToggle}
        className={clsx(
          basePillClasses,
          disabled && 'cursor-not-allowed opacity-50',
          isOpen
            ? 'border-primary bg-primary text-primary-foreground shadow-card'
            : hasValue
              ? 'border-secondary bg-secondary text-secondary-foreground'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
        )}
      >
        {label}
      </button>

      {isOpen && (
        <div className='absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card'>
          <div className='max-h-64 space-y-2 overflow-y-auto text-sm'>
            {options.map((option) => {
              const isOptionDisabled = disabledValues?.includes(option.value) ?? false;
              return (
                <label
                  key={option.value}
                  className={clsx(
                    'flex items-center gap-2',
                    isOptionDisabled ? 'cursor-not-allowed opacity-40 text-slate-400' : 'text-slate-700'
                  )}
                >
                  <input
                    type='radio'
                    name={filterKey}
                    value={option.value}
                    checked={draftValue === option.value}
                    onChange={() => { if (!isOptionDisabled) setDraftValue(option.value); }}
                    disabled={isOptionDisabled}
                    className='h-4 w-4 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
          <div className='mt-4 flex items-center justify-between text-sm'>
            {clearable ? (
              <button
                type='button'
                onClick={handleClear}
                className='text-slate-500 hover:text-slate-700'
              >
                Clear
              </button>
            ) : (
              <div />
            )}
            <button
              type='button'
              onClick={handleApply}
              disabled={isSubmitting}
              className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400'
            >
              {isSubmitting ? 'Applying…' : 'Apply'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
