// Types
export {
  FieldId,
  type FieldInputType,
  type FieldContext,
  type SalesforceFieldMapping,
  type FieldOption,
  type FieldDefinition,
  type FieldComponentProps,
  type FieldValues,
} from './types';

// Registry & Options
export {
  FIELD_REGISTRY,
  INSURANCE_OPTIONS,
  SERVICE_OPTIONS,
  SERVICE_OPTIONS_WITH_DESCRIPTIONS,
  STATE_OPTIONS,
  ALL_US_STATES,
  SUPPORTED_STATE_CODES,
  isSupportedState,
  getField,
  getFieldsForContext,
  getSalesforceFieldMap,
  type SupportedStateCode,
} from './registry';

// Components
export {
  TextField,
  PhoneField,
  SelectField,
  AutocompleteField,
  CheckboxField,
  StateSelectField,
  DynamicField,
  BookingFormFields,
  type BookingFormFieldsProps,
} from './components';

// Form Adapters
export {
  StandardForm,
  ConversationalForm,
  type StandardFormProps,
  type ConversationalFormProps,
} from './forms';

// Hooks
export {
  useBookingFormFields,
  type UseBookingFormFieldsOptions,
  type UseBookingFormFieldsReturn,
} from './hooks';

