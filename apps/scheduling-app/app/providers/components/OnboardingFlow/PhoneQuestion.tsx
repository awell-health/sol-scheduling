'use client';

import { useState, useMemo } from 'react';
import posthog from 'posthog-js';
import {
  PhoneInput,
  isValidPhoneNumber,
  type E164Number,
} from '../../../../components/ui/phone-input';
import { Button } from '../../../../components/ui/button';
import {
  createLeadAction,
  storeLeadId,
  getStoredLeadId,
} from '../../_lib/salesforce';

type PhoneQuestionProps = {
  value: string | null;
  onChange: (value: string) => void;
  onContinue: () => void;
  /** Pre-collected onboarding data to include in lead */
  state?: string | null;
  service?: string | null;
};

export function PhoneQuestion({
  value,
  onChange,
  onContinue,
  state,
  service,
}: PhoneQuestionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate as US phone number (value is already E.164 from the input)
  const isValid = useMemo(() => {
    if (!value) return false;
    try {
      return isValidPhoneNumber(value, 'US');
    } catch {
      return false;
    }
  }, [value]);

  const handleChange = (newValue: E164Number | undefined) => {
    // react-phone-number-input returns E.164 format directly (e.g., "+16175551234")
    onChange(newValue ?? '');
  };

  const handleContinue = async () => {
    if (!isValid || isSubmitting || !value) return;

    setIsSubmitting(true);

    // Value is already in E.164 format from react-phone-number-input
    const e164Phone = value;
    const phoneDigits = value.replace(/\D/g, '');

    // Check if we already have a lead for this phone
    const existingLeadId = getStoredLeadId(phoneDigits);

    if (!existingLeadId) {
      // Fire-and-forget: Create lead in background
      createLeadAction({
        phone: e164Phone,
        state: state ?? undefined,
        service: service ?? undefined,
        posthogDistinctId: posthog.get_distinct_id(),
      })
        .then((result) => {
          if (result.success && result.leadId) {
            storeLeadId(result.leadId, phoneDigits);
          }
        })
        .catch((error) => {
          console.error('Failed to create lead:', error);
        });
    }

    // Continue immediately - don't wait for Salesforce
    onContinue();
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      e.preventDefault();
      handleContinue();
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-1 md:px-0">
      <div>
        <h2 className="text-2xl font-semibold text-primary md:text-3xl">
          What is your phone number?
        </h2>
        <p className="mt-2 text-sm text-slate-700 md:mt-3 md:text-lg">
          We'll use this to send appointment reminders and updates.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <PhoneInput
            value={(value as E164Number) ?? undefined}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="h-14 text-lg"
            placeholder="(555) 555-5555"
            usOnly
          />
          <p className="text-xs text-slate-500">
            U.S. phone numbers only. Standard message and data rates may apply.
          </p>
          {value && !isValid && (
            <p className="text-xs font-medium text-red-600">
              Please enter a valid 10-digit U.S. phone number.
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!isValid || isSubmitting}
          flashOnClick
          size="lg"
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
