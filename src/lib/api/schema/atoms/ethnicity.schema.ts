import { z } from 'zod';

export enum Ethnicity {
  Asian = 'Asian',
  BlackOrAfricanAmerican = 'Black or African American',
  HispanicOrLatinx = 'Hispanic or Latinx',
  White = 'White',
  Other = 'Other'
}
export const EthnicitySchema = z.nativeEnum(Ethnicity);
