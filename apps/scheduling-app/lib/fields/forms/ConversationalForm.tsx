'use client';

import { useCallback, useMemo, useState } from 'react';
import { DynamicField } from '../components';
import { Button } from '../../../components/ui/button';
import type { FieldDefinition, FieldValues } from '../types';

export interface ConversationalFormProps {
  /** Fields to render (in order) */
  fields: FieldDefinition[];
  
  /** Current form values */
  values: FieldValues;
  
  /** Change handler - called with field ID and new value */
  onChange: (fieldId: string, value: string | boolean | null) => void;
  
  /** Called when user advances past a field */
  onFieldComplete?: (fieldId: string, value: string | boolean | null) => void;
  
  /** Called when all fields are complete */
  onComplete?: (values: FieldValues) => void;
  
  /** Validation errors keyed by field ID */
  errors?: Record<string, string>;
  
  /** Current step index (controlled) - if not provided, component manages internally */
  currentStep?: number;
  
  /** Callback when step changes (for controlled mode) */
  onStepChange?: (step: number) => void;
  
  /** Whether to show back button */
  showBack?: boolean;
  
  /** Custom continue button text */
  continueText?: string;
  
  /** Whether form is disabled (e.g., during submission) */
  disabled?: boolean;
  
  /** Optional header to show above current question */
  header?: React.ReactNode;
  
  /** Optional className for the container */
  className?: string;
}

/**
 * Conversational form adapter - renders one field at a time.
 * Used for the onboarding flow where questions appear sequentially.
 */
export function ConversationalForm({
  fields,
  values,
  onChange,
  onFieldComplete,
  onComplete,
  errors = {},
  currentStep: controlledStep,
  onStepChange,
  showBack = true,
  continueText = 'Continue',
  disabled = false,
  header,
  className = '',
}: ConversationalFormProps) {
  // Internal step state (used if not controlled)
  const [internalStep, setInternalStep] = useState(0);
  
  // Use controlled or internal step
  const currentStep = controlledStep ?? internalStep;
  const setCurrentStep = onStepChange ?? setInternalStep;
  
  // Current field
  const currentField = fields[currentStep];
  const currentValue = currentField ? values[currentField.id] ?? null : null;
  const currentError = currentField ? errors[currentField.id] : undefined;
  
  // Check if current field is valid
  const isCurrentValid = useMemo(() => {
    if (!currentField) return false;
    
    const value = currentValue;
    
    // For required fields, must have a value
    if (currentField.required !== false) {
      if (value === null || value === undefined || value === '') {
        return false;
      }
      // For checkbox fields, must be true
      if (currentField.inputType === 'checkbox' && value !== true) {
        return false;
      }
    }
    
    // No error means valid
    return !currentError;
  }, [currentField, currentValue, currentError]);
  
  // Progress info
  const progress = useMemo(() => ({
    current: currentStep + 1,
    total: fields.length,
    percentage: fields.length > 0 ? ((currentStep + 1) / fields.length) * 100 : 0,
  }), [currentStep, fields.length]);
  
  const handleChange = useCallback(
    (value: string | boolean | null) => {
      if (currentField) {
        onChange(currentField.id, value);
      }
    },
    [currentField, onChange]
  );
  
  const handleContinue = useCallback(() => {
    if (!currentField || !isCurrentValid) return;
    
    // Notify that this field is complete
    onFieldComplete?.(currentField.id, currentValue);
    
    // Check if we're at the last field
    if (currentStep >= fields.length - 1) {
      // All fields complete
      onComplete?.(values);
    } else {
      // Advance to next field
      setCurrentStep(currentStep + 1);
    }
  }, [
    currentField,
    currentValue,
    currentStep,
    fields.length,
    isCurrentValid,
    onFieldComplete,
    onComplete,
    setCurrentStep,
    values,
  ]);
  
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);
  
  // Handle enter key to continue
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && isCurrentValid && !disabled) {
        e.preventDefault();
        handleContinue();
      }
    },
    [isCurrentValid, disabled, handleContinue]
  );
  
  if (!currentField) {
    return null;
  }
  
  const isLastStep = currentStep >= fields.length - 1;
  
  return (
    <div className={`flex flex-col gap-6 ${className}`} onKeyDown={handleKeyDown}>
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Question {progress.current} of {progress.total}</span>
          <span>{Math.round(progress.percentage)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
      
      {/* Optional header */}
      {header}
      
      {/* Current field */}
      <div className="min-h-[120px]">
        <DynamicField
          definition={currentField}
          value={currentValue}
          onChange={handleChange}
          error={currentError}
          disabled={disabled}
          autoFocus
        />
      </div>
      
      {/* Navigation buttons */}
      <div className="flex items-center gap-3">
        {showBack && currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={disabled}
          >
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!isCurrentValid || disabled}
          className="flex-1"
        >
          {isLastStep ? 'Complete' : continueText}
        </Button>
      </div>
    </div>
  );
}

