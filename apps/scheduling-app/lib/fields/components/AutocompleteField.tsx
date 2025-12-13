'use client';

import { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import type { FieldComponentProps } from '../types';

/**
 * Autocomplete field component.
 * Used for fields like insurance where users can type to filter options.
 */
export function AutocompleteField({
  definition,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  autoFocus,
}: FieldComponentProps) {
  const stringValue = typeof value === 'string' ? value : '';
  const [query, setQuery] = useState(stringValue);
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = definition.options?.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  ) ?? [];

  const handleInputChange = (next: string) => {
    setQuery(next);
    setIsOpen(true);

    // Check for exact match
    const exactMatch = definition.options?.find(
      (option) => option.label.toLowerCase() === next.toLowerCase()
    );

    if (exactMatch) {
      onChange(exactMatch.value);
    } else if (next === '') {
      onChange(null);
    }
  };

  const handleSelectOption = (option: { value: string; label: string }) => {
    onChange(option.value);
    setQuery(option.label);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={definition.id}>{definition.label}</Label>
      <div className="relative">
        <Input
          id={definition.id}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Delay to allow click handlers to run
            setTimeout(() => {
              setIsOpen(false);
              onBlur?.();
            }, 150);
          }}
          placeholder={definition.placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
          className={error ? 'border-red-500 focus-visible:ring-red-500/20' : undefined}
        />
        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="cursor-pointer px-3 py-1.5 hover:bg-slate-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {definition.description && (
        <p className="text-xs text-slate-500">{definition.description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

