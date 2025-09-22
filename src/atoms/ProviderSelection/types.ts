/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ClinicalFocus,
  DeliveryMethod,
  Ethnicity,
  Gender,
  type GetProvidersInputType,
  Modality,
  TimeOfTheDay,
  Language,
  Insurance,
  LocationState,
  LocationFacility,
  LocationStateToNameMapping,
  type GetProvidersResponseType
} from '../../lib/api';
import { upperFirst } from 'lodash-es';

export type Provider = GetProvidersResponseType['data'][number];

export type FilterEnum = Record<string, string | number> &
  (
    | typeof Gender
    | typeof Ethnicity
    | typeof Modality
    | typeof TimeOfTheDay
    | typeof Language
    | typeof Insurance
    | typeof ClinicalFocus
    | typeof DeliveryMethod
    | typeof LocationState
    | typeof LocationFacility
  );

export interface FilterOption<T extends FilterEnum> {
  label: T[keyof T]; // key is one of the values of the enum (T's keys)
  value: string;
}

export type FilterKey = keyof GetProvidersInputType | 'state' | 'facility';

// FilterType Interface Definition
export interface FilterType<T extends FilterEnum> {
  label: string;
  key: FilterKey;
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
    'options' in f
  );
}

export const optionsFromEnum = (enumType: FilterEnum) => {
  return Object.entries(enumType).map(([_key, value]) => ({
    label: upperFirst(value as string),
    value: value as string
  }));
};

export const optionsForState = () => {
  return Object.entries(LocationState).map(([key, value]) => ({
    label: LocationStateToNameMapping[
      key as keyof typeof LocationStateToNameMapping
    ] as string,
    value: value as string
  }));
};

export const optionsForFacility = (state: LocationState | undefined) => {
  if (!state) {
    return [];
  }
  const facilities = Object.entries(LocationFacility).map(([_key, value]) => ({
    label: value.slice(5),
    value: value as string
  }));
  return facilities.filter((facility) => facility.value.startsWith(state));
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
