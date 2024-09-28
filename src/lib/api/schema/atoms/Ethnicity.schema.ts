import { isEmpty, isNil } from 'lodash-es';
import { z } from 'zod';

export enum Ethnicity {
  Asian = 'Asian',
  BlackOrAfricanAmerican = 'Black or African American',
  HispanicOrLatinx = 'Hispanic or Latinx',
  White = 'White',
  Other = 'Other'
}
export const EthnicitySchema = z
  .union([z.nativeEnum(Ethnicity), z.string(), z.undefined()])
  .transform((e) => {
    if (isNil(e) || isEmpty(e)) return undefined;
    return e as Ethnicity;
  });
