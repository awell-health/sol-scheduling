'use client';

import { useCallback } from 'react';
import { DynamicField } from '../components';
import type { FieldDefinition, FieldValues } from '../types';

export interface StandardFormProps {
  /** Fields to render */
  fields: FieldDefinition[];
  
  /** Current form values */
  values: FieldValues;
  
  /** Change handler - called with field ID and new value */
  onChange: (fieldId: string, value: string | boolean | null) => void;
  
  /** Blur handler - called with field ID */
  onBlur?: (fieldId: string) => void;
  
  /** Validation errors keyed by field ID */
  errors?: Record<string, string>;
  
  /** Whether all fields are disabled */
  disabled?: boolean;
  
  /** Optional className for the container */
  className?: string;
}

/**
 * Standard form adapter - renders all fields together.
 * Used for the booking form where multiple fields appear at once.
 */
export function StandardForm({
  fields,
  values,
  onChange,
  onBlur,
  errors = {},
  disabled = false,
  className = 'space-y-4',
}: StandardFormProps) {
  const handleChange = useCallback(
    (fieldId: string) => (value: string | boolean | null) => {
      onChange(fieldId, value);
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (fieldId: string) => () => {
      onBlur?.(fieldId);
    },
    [onBlur]
  );

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {fields.map((field, index) => (
        <DynamicField
          key={field.id}
          definition={field}
          value={values[field.id] ?? null}
          onChange={handleChange(field.id)}
          onBlur={handleBlur(field.id)}
          error={errors[field.id]}
          disabled={disabled}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}

