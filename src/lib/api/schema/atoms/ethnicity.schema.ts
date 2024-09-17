import { z } from 'zod';

export enum Ethnicity {
  'Asian' = 'Asian',
  'Black or African American' = 'Black or African American',
  'Hispanic or Latinx' = 'Hispanic or Latinx',
  'White' = 'White',
  'Other' = 'Other'
}
export const EthnicitySchema = z.nativeEnum(Ethnicity);
