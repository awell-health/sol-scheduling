import { isEmpty } from 'lodash-es';
import { z } from 'zod';

export enum Modality {
  'Psychiatric' = 'Psychiatric',
  'Therapy' = 'Therapy',
  'Both' = 'Both',
  'Not sure' = 'Not sure'
}

export const TherapeuticModalitySchema = z
  .nativeEnum(Modality)
  .optional()
  .transform((value) => {
    if (value === Modality.Therapy) {
      return 'Therapy';
    } else if (!isEmpty(value)) {
      return 'Psychiatric';
    } else {
      return undefined;
    }
  });
