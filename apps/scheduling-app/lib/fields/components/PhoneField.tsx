'use client';

import { PhoneInput, type E164Number } from '../../../components/ui/phone-input';
import { Label } from '../../../components/ui/label';
import type { FieldComponentProps } from '../types';

/**
 * Phone number input field component.
 * Uses the phone-input component with US-only validation.
 */
export function PhoneField({
  definition,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  autoFocus,
}: FieldComponentProps) {
  const phoneValue = typeof value === 'string' ? (value as E164Number) : undefined;

  return (
    <div className="space-y-1">
      <Label htmlFor={definition.id}>{definition.label}</Label>
      <PhoneInput
        id={definition.id}
        value={phoneValue}
        onChange={(val) => onChange(val ?? '')}
        onBlur={onBlur}
        disabled={disabled}
        autoFocus={autoFocus}
        usOnly
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

