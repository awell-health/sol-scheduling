'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { DynamicField } from './DynamicField';
import type { FieldDefinition } from '../types';

export interface BookingFormFieldsProps {
  /** Fields to render */
  fields: FieldDefinition[];
  
  /** Whether all fields are disabled */
  disabled?: boolean;
}

/**
 * Renders booking form fields using react-hook-form context.
 * Must be used inside a FormProvider.
 */
export function BookingFormFields({
  fields,
  disabled = false,
}: BookingFormFieldsProps) {
  const { control, formState: { errors } } = useFormContext();

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          name={field.id}
          control={control}
          render={({ field: formField }) => (
            <DynamicField
              definition={field}
              value={formField.value ?? null}
              onChange={(value) => formField.onChange(value)}
              onBlur={formField.onBlur}
              error={errors[field.id]?.message as string | undefined}
              disabled={disabled}
              autoFocus={index === 0}
            />
          )}
        />
      ))}
    </div>
  );
}

