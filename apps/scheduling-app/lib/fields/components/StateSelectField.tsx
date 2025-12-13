'use client';

import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { isSupportedState } from '../registry';
import type { FieldComponentProps } from '../types';

/**
 * State select field component.
 * Shows all US states with visual indication of supported states.
 */
export function StateSelectField({
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
        <SelectContent className="max-h-64">
          {definition.options?.map((option) => {
            const isSupported = isSupportedState(option.value);
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className={isSupported ? '' : 'text-slate-400'}
              >
                {option.label}
                {isSupported && (
                  <span className="ml-1 text-xs text-emerald-600">✓</span>
                )}
              </SelectItem>
            );
          })}
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

