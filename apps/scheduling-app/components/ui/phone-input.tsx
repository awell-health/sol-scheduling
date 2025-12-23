'use client';

import * as React from 'react';
import clsx, { type ClassValue } from 'clsx';
import PhoneInputComponent from 'react-phone-number-input';
import type { Country, Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Input } from './input';

const cn = (...values: ClassValue[]) => clsx(values);

// Re-export utilities from react-phone-number-input
export {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'react-phone-number-input';

// E164Number is a branded string type for E.164 formatted phone numbers
export type E164Number = Value;

type PhoneInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'ref'
> & {
  value?: E164Number;
  onChange?: (value: E164Number | undefined) => void;
  defaultCountry?: Country;
  /**
   * If true, shows only the US country (no selector dropdown)
   * @default true
   */
  usOnly?: boolean;
  'data-phi'?: boolean;
  'data-attr-redact'?: boolean;
};

/**
 * Phone input component that stores value in E.164 format (+1XXXXXXXXXX)
 * while displaying a user-friendly masked input.
 */
const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, usOnly = true, defaultCountry = 'US', 'data-phi': dataPhi, 'data-attr-redact': dataAttrRedact, ...props }, ref) => {
    // Create a ref holder for the input that we can pass to react-phone-number-input
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Forward the ref
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Memoize the input component to prevent remounting on each render
    const InputComponent = React.useMemo(
      () => (inputProps: React.ComponentProps<'input'>) => (
        <PhoneInputField {...inputProps} data-phi={dataPhi} data-attr-redact={dataAttrRedact} />
      ),
      [dataPhi, dataAttrRedact]
    );

    // Memoize the country selector component (always null for US-only mode)
    const CountrySelectComponent = React.useMemo(() => () => null, []);

    // US-only mode: no country selector, cleaner UI
    return (
      <PhoneInputComponent
        className={cn('sol-phone-input flex', className)}
        countrySelectComponent={CountrySelectComponent}
        inputComponent={InputComponent}
        defaultCountry={defaultCountry}
        countries={usOnly ? ['US'] : undefined}
        international={false}
        onChange={(value) => onChange?.(value)}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

const PhoneInputField = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { 'data-phi'?: boolean; 'data-attr-redact'?: boolean }
>(({ className, 'data-phi': dataPhi, 'data-attr-redact': dataAttrRedact, ...props }, ref) => (
  <Input
    ref={ref}
    type="tel"
    inputMode="tel"
    autoComplete="tel"
    data-slot="phone-input"
    {...(dataPhi ? { 'data-phi': 'true' } : {})}
    {...(dataAttrRedact ? { 'data-attr-redact': 'true' } : {})}
    className={cn('w-full', className)}
    {...props}
  />
));
PhoneInputField.displayName = 'PhoneInputField';

export { PhoneInput };
