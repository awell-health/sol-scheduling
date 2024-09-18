import {
  ClinicalFocus,
  DeliveryMethod,
  Ethnicity,
  Gender,
  GetProvidersInputType,
  GetProvidersResponseType,
  Modality
} from '../../lib/api';

export type Provider = GetProvidersResponseType['data'][number];

export type FilterEnum = Record<string, string | number> &
  (
    | typeof Gender
    | typeof Ethnicity
    | typeof Modality
    | typeof ClinicalFocus
    | typeof DeliveryMethod
  );

export interface FilterOption<T extends FilterEnum> {
  label: T[keyof T]; // key is one of the values of the enum (T's keys)
  value: string;
}

// FilterType Interface Definition
export interface FilterType<T extends FilterEnum> {
  label: string;
  key: keyof GetProvidersInputType; // key should match the field in GetProvidersInputType
  selectType: 'single' | 'multi';
  enum: FilterEnum;
  options: FilterOption<T>[]; // array of FilterOption based on the enum
  selectedOptions: FilterType<T>['options'][0]['value'][];
}

export function isFilterType(f: unknown): f is FilterType<FilterEnum> {
  return (
    f !== null &&
    f !== undefined &&
    typeof f === 'object' &&
    'key' in f &&
    'label' in f
  );
}

export const optionsFromEnum = (enumType: FilterEnum) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(enumType).map(([_key, value]) => ({
    label: value as string,
    value: value as string
  }));
};

// mapping here because we cannot do it from the enum
export const optionsFromGenderEnum = () => {
  return [
    {
      label: 'Male',
      value: 'M'
    },
    {
      label: 'Female',
      value: 'F'
    },
    {
      label: 'Non-binary/non-conforming',
      value: 'Non-binary/non-conforming'
    }
  ];
};
