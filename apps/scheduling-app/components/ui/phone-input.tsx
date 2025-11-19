'use client';

import * as React from 'react';
import { Input } from './input';

export interface PhoneInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (props, ref) => {
    return (
      <Input
        ref={ref}
        type='tel'
        inputMode='tel'
        autoComplete='tel'
        placeholder='(555) 123-4567'
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';


