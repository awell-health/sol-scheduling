import { z } from 'zod';

export enum Insurance {
  'Aetna' = 'Aetna',
  'BCBS / Anthem' = 'BCBS / Anthem',
  'Cigna / Evernorth' = 'Cigna / Evernorth',
  'Elevance / Carelon' = 'Elevance / Carelon',
  'First Health' = 'First Health',
  'Kaiser' = 'Kaiser',
  'Magnacare' = 'Magnacare',
  'Multiplan' = 'Multiplan',
  'Northwell Direct' = 'Northwell Direct',
  'Tricare' = 'Tricare',
  'United / Optum' = 'United / Optum',
  'Other' = 'Other'
}

export const InsuranceSchema = z.nativeEnum(Insurance).optional();
