'use client';

import type { FieldComponentProps } from '../types';

/**
 * Checkbox field component.
 * Used for consent and boolean fields.
 */
export function CheckboxField({
  definition,
  value,
  onChange,
  error,
  disabled,
}: FieldComponentProps) {
  const checked = typeof value === 'boolean' ? value : false;

  return (
    <div className="space-y-1">
      <label className="flex items-start gap-2 text-xs text-slate-700">
        <input
          type="checkbox"
          id={definition.id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary"
        />
        <span>{definition.label}</span>
      </label>
      {definition.description && (
        <p className="text-xs text-slate-500 pl-6">{definition.description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

