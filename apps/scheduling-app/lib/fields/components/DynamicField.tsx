'use client';

import type { FieldComponentProps } from '../types';
import { TextField } from './TextField';
import { PhoneField } from './PhoneField';
import { SelectField } from './SelectField';
import { AutocompleteField } from './AutocompleteField';
import { CheckboxField } from './CheckboxField';
import { StateSelectField } from './StateSelectField';

/**
 * Dynamic field component that renders the appropriate input
 * based on the field definition's inputType.
 */
export function DynamicField(props: FieldComponentProps) {
  const { definition } = props;

  switch (definition.inputType) {
    case 'text':
      return <TextField {...props} />;

    case 'phone':
      return <PhoneField {...props} />;

    case 'select':
      return <SelectField {...props} />;

    case 'autocomplete':
      return <AutocompleteField {...props} />;

    case 'checkbox':
      return <CheckboxField {...props} />;

    case 'state-select':
      return <StateSelectField {...props} />;

    default:
      // Fallback to text input
      return <TextField {...props} />;
  }
}

