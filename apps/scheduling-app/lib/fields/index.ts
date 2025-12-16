// Types
export {
  FieldId,
  type FieldInputType,
  type FieldContext,
  type SalesforceFieldMapping,
  type FieldOption,
  type FieldDefinition,
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
  buildSchemaFromFields,
  buildBookingFormSchema,
  getSalesforceReadField,
  getSalesforceWriteField,
  getStorageKey,
  getStorableFieldIds,
  ONBOARDING_STORAGE_KEYS,
  type SupportedStateCode,
} from './registry';

// Hooks
export {
  useBookingFormFields,
  type UseBookingFormFieldsOptions,
  type UseBookingFormFieldsReturn,
} from './hooks';

