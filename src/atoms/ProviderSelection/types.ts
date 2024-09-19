/* eslint-disable @typescript-eslint/no-unused-vars */
import { getStateByFacility } from '@/lib/utils/location';
import {
  ClinicalFocus,
  DeliveryMethod,
  Ethnicity,
  Gender,
  GetProvidersInputType,
  GetProvidersResponseType,
  Modality,
  LocationState,
  LocationFacility,
  LocationStateToNameMapping
} from '../../lib/api';

export type Provider = GetProvidersResponseType['data'][number];

export type FilterEnum = Record<string, string | number> &
  (
    | typeof Gender
    | typeof Ethnicity
    | typeof Modality
    | typeof ClinicalFocus
    | typeof DeliveryMethod
    | typeof LocationState
    | typeof LocationFacility
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
  return Object.entries(enumType).map(([_key, value]) => ({
    label: value as string,
    value: value as string
  }));
};

export const optionsForLocation = () => {
  const states = Object.entries(LocationState).map(([key, value]) => ({
    label: LocationStateToNameMapping[
      key as keyof typeof LocationStateToNameMapping
    ] as string,
    value: value as string
  }));

  const facilities = Object.entries(LocationFacility).map(([_key, value]) => ({
    label: `${getStateByFacility(value)} - ${value}`,
    value: value as string
  }));
  return [...states, ...facilities];
};

// mapping here because we cannot do it from the enum
export const optionsForGender = () => {
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
