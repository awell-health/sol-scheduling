import { isEmpty } from 'lodash-es';
import {
  ClinicalFocus,
  DeliveryMethod,
  Ethnicity,
  Gender,
  GetProvidersInputType,
  Modality
} from '../../lib/api';

export type FilterEnum = Record<string, string | number> &
  (
    | typeof Gender
    | typeof Ethnicity
    | typeof Modality
    | typeof ClinicalFocus
    | typeof DeliveryMethod
  );

export const getEnumKeyFromVal = (enumType: FilterEnum, value: string) => {
  return (
    Object.keys(enumType).find((key) => enumType[key] === value) ?? 'Unknown'
  ).replace('_', ' ');
};

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

export const displaySelectedValues = <T extends FilterEnum>(
  filter: FilterType<T>
) => {
  if (isEmpty(filter.selectedOptions)) {
    return '';
  }
  return filter.selectedOptions
    .map((val) => getEnumKeyFromVal(filter.enum, val))
    .join(', ');
};

export const optionsFromEnum = (enumType: FilterEnum) => {
  return Object.entries(enumType).map(([key, value]) => ({
    label: key.replace('_', ' ') as FilterEnum[keyof FilterEnum],
    value: value as string
  }));
};
