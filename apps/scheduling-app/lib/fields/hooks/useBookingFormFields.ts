'use client';

import { useMemo } from 'react';
import { z } from 'zod';
import { useFeatureFlagEnabled } from 'posthog-js/react';
import { FieldId, type FieldDefinition, type FieldValues } from '../types';
import { getFieldsForContext } from '../registry';

export interface UseBookingFormFieldsOptions {
  /** Current onboarding preferences (to skip already-answered fields) */
  answeredValues?: FieldValues;
}

export interface UseBookingFormFieldsReturn {
  /** Fields to render in the booking form */
  fields: FieldDefinition[];
  
  /** Zod validation schema for the visible fields */
  validationSchema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  
  /** Default values for the form (from already-answered preferences) */
  defaultValues: FieldValues;
  
  /** Check if a specific field should be shown */
  shouldShowField: (fieldId: FieldId) => boolean;
}

/**
 * Hook to determine which fields to show in the booking form.
 * Considers:
 * - Fields configured for 'booking' context
 * - Feature flag gating
 * - Already-answered preferences (to skip them)
 */
export function useBookingFormFields(
  options: UseBookingFormFieldsOptions = {}
): UseBookingFormFieldsReturn {
  const { answeredValues = {} } = options;
  
  // Check feature flags for each field that has one
  const nameAtBookingEnabled = useFeatureFlagEnabled('name_at_booking');
  
  // Build the list of fields to show
  const { fields, validationSchema, defaultValues, shouldShowField } = useMemo(() => {
    const bookingFields = getFieldsForContext('booking');
    
    const visibleFields: FieldDefinition[] = [];
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    const defaults: FieldValues = {};
    const visibility: Record<string, boolean> = {};
    
    for (const field of bookingFields) {
      // Check feature flag gating
      if (field.featureFlag) {
        if (field.featureFlag === 'name_at_booking' && !nameAtBookingEnabled) {
          visibility[field.id] = false;
          continue;
        }
        // Add more feature flag checks here as needed
      }
      
      // Check if already answered
      const existingValue = answeredValues[field.id];
      const hasValue = existingValue !== null && existingValue !== undefined && existingValue !== '';
      
      // For checkbox (consent), check if it's true
      if (field.inputType === 'checkbox' && existingValue === true) {
        visibility[field.id] = false;
        defaults[field.id] = true;
        continue;
      }
      
      // For other fields, check if they have a value
      if (hasValue && field.inputType !== 'checkbox') {
        visibility[field.id] = false;
        defaults[field.id] = existingValue;
        continue;
      }
      
      // Field should be shown
      visibility[field.id] = true;
      visibleFields.push(field);
      schemaShape[field.id] = field.validation;
      
      // Set default from existing value if available
      if (existingValue !== undefined) {
        defaults[field.id] = existingValue;
      }
    }
    
    return {
      fields: visibleFields,
      validationSchema: z.object(schemaShape),
      defaultValues: defaults,
      shouldShowField: (fieldId: FieldId) => visibility[fieldId] ?? false,
    };
  }, [answeredValues, nameAtBookingEnabled]);
  
  return {
    fields,
    validationSchema,
    defaultValues,
    shouldShowField,
  };
}

