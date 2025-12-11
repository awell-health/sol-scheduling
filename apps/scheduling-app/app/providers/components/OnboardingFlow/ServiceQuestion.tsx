'use client';

import { SERVICE_OPTIONS } from '../../_lib/onboarding/config';
import { Button } from '../../../../components/ui/button';

type ServiceQuestionProps = {
  value: string | null;
  onChange: (value: string) => void;
  onContinue: () => void;
};

export function ServiceQuestion({
  value,
  onChange,
  onContinue
}: ServiceQuestionProps) {

  const canContinue = value !== null && value !== '';

  return (
    <div className='mx-auto w-full max-w-2xl space-y-4 px-1 md:space-y-6 md:px-0'>
      <div>
        <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
          What type of help are you seeking?
        </h2>
        <p className='mt-2 text-sm text-slate-700 md:mt-3 md:text-lg'>
          Choose the type of care that fits best right now. You can always
          change this later.
        </p>
      </div>

      <div className='grid gap-3 md:gap-4'>
        {SERVICE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm transition hover:border-primary/60 hover:bg-slate-50 md:gap-4 md:px-5 md:py-4 md:text-base ${
              value === option.value
                ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/20'
                : ''
            }`}
          >
            <input
              type='radio'
              name='onboarding-service'
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className='mt-1 h-5 w-5 rounded-full border-slate-300 text-primary accent-primary focus:ring-primary/30'
            />
            <div>
              <p className='font-semibold'>{option.label}</p>
              <p className='mt-1 text-xs text-slate-600 md:text-base'>
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      <Button
        type='button'
        onClick={onContinue}
        disabled={!canContinue}
        flashOnClick
        size='lg'
        className='w-full'
      >
        Continue
      </Button>
    </div>
  );
}
