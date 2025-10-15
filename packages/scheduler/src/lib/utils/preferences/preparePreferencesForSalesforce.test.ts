import { expect, describe, it } from '@jest/globals';
import { preparePreferencesForSalesforce } from '.';
import {
  ClinicalFocus,
  DeliveryMethod,
  Ethnicity,
  Gender,
  GetProvidersInputType,
  LocationState
} from '../../../lib/api';

describe('SalesforcePreferencesSchema', () => {
  it('should return "In-Person" when deliveryMethod is undefined', () => {
    const preferences = {
      age: '18',
      clinicalFocus: [ClinicalFocus.Depression, ClinicalFocus.Anxiety],
      deliveryMethod: undefined,
      ethnicity: Ethnicity.BlackOrAfricanAmerican,
      gender: Gender.Male,
      language: undefined,
      location: {
        facility: undefined,
        state: LocationState.CO
      },
      therapeuticModality: undefined
    } satisfies GetProvidersInputType;

    const result = preparePreferencesForSalesforce(preferences);

    expect(result).toEqual({
      ...preferences,
      deliveryMethod: 'Both'
    });
  });

  it('should return the provided delivery method (Telehealth)', () => {
    const preferences = {
      age: '18',
      clinicalFocus: [ClinicalFocus.Depression, ClinicalFocus.Anxiety],
      deliveryMethod: DeliveryMethod.Telehealth,
      ethnicity: Ethnicity.BlackOrAfricanAmerican,
      gender: Gender.Male,
      language: undefined,
      location: {
        facility: undefined,
        state: LocationState.CO
      },
      therapeuticModality: undefined
    } satisfies GetProvidersInputType;

    const result = preparePreferencesForSalesforce(preferences);

    expect(result).toEqual({
      ...preferences,
      deliveryMethod: 'Telehealth'
    });
  });

  it('should return the provided delivery method (In-Person)', () => {
    const preferences = {
      age: '18',
      clinicalFocus: [ClinicalFocus.Depression, ClinicalFocus.Anxiety],
      deliveryMethod: DeliveryMethod.InPerson,
      ethnicity: Ethnicity.BlackOrAfricanAmerican,
      gender: Gender.Male,
      language: undefined,
      location: {
        facility: undefined,
        state: LocationState.CO
      },
      therapeuticModality: undefined
    } satisfies GetProvidersInputType;

    const result = preparePreferencesForSalesforce(preferences);

    expect(result).toEqual({
      ...preferences,
      deliveryMethod: 'In-Person'
    });
  });
});
