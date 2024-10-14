import { z } from 'zod';

export enum Modality {
  'Psychiatric' = 'Psychiatric',
  'Therapy' = 'Therapy',
  'Both' = 'Both',
  'Not sure' = 'Not sure'
}

export const TherapeuticModalitySchema = z
  .nativeEnum(Modality)
  .transform((value) => {
    if (value === Modality.Therapy) {
      return 'Therapy';
    } else {
      return 'Psychiatric';
    }
  });
