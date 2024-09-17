import { z } from 'zod';

export enum Gender {
  Male = 'M',
  Female = 'F',
  NonBinaryOrNonConforming = 'Non-binary/non-conforming'
}

export const GenderSchema = z.nativeEnum(Gender);
