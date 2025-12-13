'use client';

import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import type { FieldComponentProps } from '../types';

/**
 * Select dropdown field component.
 * Used for fields with a fixed set of options.
 */
export function SelectField({
  definition,
  value,
  onChange,
  error,
  disabled,
}: FieldComponentProps) {
  const stringValue = typeof value === 'string' ? value : '';

  return (
    <div className="space-y-1">
      <Label htmlFor={definition.id}>{definition.label}</Label>
      <Select
        value={stringValue}
        onValueChange={(val) => onChange(val)}
        disabled={disabled}
      >
        <SelectTrigger
          id={definition.id}
          className={error ? 'border-red-500 focus-visible:ring-red-500/20' : undefined}
        >
          <SelectValue placeholder={definition.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {definition.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {definition.description && (
        <p className="text-xs text-slate-500">{definition.description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

