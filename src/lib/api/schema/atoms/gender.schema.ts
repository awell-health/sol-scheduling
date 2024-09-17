import { z } from 'zod';

export enum Gender {
  Male = 'M',
  Female = 'F',
  'Non-binary/non-conforming' = 'Non-binary/non-conforming'
}

export const GenderSchema = z.nativeEnum(Gender);
