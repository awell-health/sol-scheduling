'use client';

import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import type { FieldComponentProps } from '../types';

/**
 * Text input field component.
 * Used for simple text fields like first name, last name.
 */
export function TextField({
  definition,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  autoFocus,
}: FieldComponentProps) {
  const stringValue = typeof value === 'string' ? value : '';

  return (
    <div className="space-y-1">
      <Label htmlFor={definition.id}>{definition.label}</Label>
      <Input
        id={definition.id}
        type="text"
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={definition.placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={error ? 'border-red-500 focus-visible:ring-red-500/20' : undefined}
      />
      {definition.description && (
        <p className="text-xs text-slate-500">{definition.description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

