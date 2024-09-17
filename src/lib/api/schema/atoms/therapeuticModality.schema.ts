import { z } from 'zod';

export enum Modality {
  'Psychiatric' = 'Psychiatric',
  'Therapy' = 'Therapy'
}

export const TherapeuticModalitySchema = z.nativeEnum(Modality);
