'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateLeadAction, getAnyStoredLeadId } from '../../_lib/salesforce';
import { INSURANCE_OPTIONS, FIELD_REGISTRY, FieldId } from '@/lib/fields';

type InsuranceQuestionProps = {
  value: string | null;
  onChange: (value: string) => void;
  onContinue: () => void;
};

export function InsuranceQuestion({ value, onChange, onContinue }: InsuranceQuestionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the label for the selected value
  const selectedLabel = useMemo(() => {
    if (!value) return '';
    const option = INSURANCE_OPTIONS.find((opt) => opt.value === value);
    return option?.label ?? '';
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return INSURANCE_OPTIONS;
    const query = searchQuery.toLowerCase();
    return INSURANCE_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const canContinue = value !== null && value !== '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);
    setIsDropdownOpen(true);

    // Check for exact match
    const exactMatch = INSURANCE_OPTIONS.find(
      (option) => option.label.toLowerCase() === inputValue.toLowerCase()
    );

    if (exactMatch) {
      onChange(exactMatch.value);
    } else if (inputValue === '') {
      onChange('');
    }
  };

  const handleOptionClick = (option: typeof INSURANCE_OPTIONS[number]) => {
    onChange(option.value);
    setSearchQuery(option.label);
    setIsDropdownOpen(false);
  };

  const insuranceField = FIELD_REGISTRY[FieldId.INSURANCE];

  return (
    <div className='mx-auto w-full max-w-2xl space-y-6 px-1 md:px-0'>
      <div>
        <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
          {insuranceField.conversationalQuestion ?? insuranceField.label}
        </h2>
        <p className='mt-2 text-sm text-slate-700 md:mt-3 md:text-lg'>
          {insuranceField.conversationalDescription ?? insuranceField.description}
        </p>
      </div>

      <div className='space-y-3'>
        <div className='relative'>
          <Input
            type='text'
            placeholder='Search insurance carriers…'
            value={searchQuery || selectedLabel}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => {
              // Slight delay to allow option click handlers to run
              setTimeout(() => setIsDropdownOpen(false), 150);
            }}
            autoComplete='off'
            className='h-14 text-base'
          />
          {isDropdownOpen && filteredOptions.length > 0 && (
            <ul className='absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg'>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`cursor-pointer px-4 py-2.5 transition hover:bg-slate-50 ${
                    value === option.value ? 'bg-primary/5 font-medium' : ''
                  }`}
                  onMouseDown={(event) => {
                    // Prevent input blur before onClick runs
                    event.preventDefault();
                  }}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
          {isDropdownOpen && filteredOptions.length === 0 && searchQuery && (
            <div className='absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg'>
              No insurance carriers match your search.
            </div>
          )}
        </div>

        <p className='text-center text-xs text-slate-500'>
          Don't see your insurance? Select "Other" and we'll help you figure it out.
        </p>

        <Button
          type='button'
          onClick={async () => {
            if (!canContinue || isSubmitting) return;
            setIsSubmitting(true);

            // Fire-and-forget: Update the lead with insurance info
            const leadId = getAnyStoredLeadId();
            if (leadId && value) {
              void updateLeadAction({ leadId, insurance: value }).catch((error) => {
                console.error('Failed to update lead insurance:', error);
              });
            }

            onContinue();
            setIsSubmitting(false);
          }}
          disabled={!canContinue || isSubmitting}
          flashOnClick
          size='lg'
          className='w-full'
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
