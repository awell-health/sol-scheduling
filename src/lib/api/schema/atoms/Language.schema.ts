import { z } from 'zod';

export enum Language {
  'Arabic' = 'Arabic',
  'Bulgarian' = 'Bulgarian',
  'Chinese (Mandarin)' = 'Chinese (Mandarin)',
  'Creole' = 'Creole',
  'French' = 'French',
  'German' = 'German',
  'Hebrew' = 'Hebrew',
  'Hindi' = 'Hindi',
  'Italian' = 'Italian',
  'Russian' = 'Russian',
  'Spanish' = 'Spanish',
  'Urdu' = 'Urdu'
}

export const LanguageSchema = z.nativeEnum(Language).optional();
