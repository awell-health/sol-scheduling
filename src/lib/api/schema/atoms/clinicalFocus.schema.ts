import { z } from 'zod';

export enum ClinicalFocus {
  ADHD = 'ADHD',
  Anxiety = 'Anxiety d/o',
  Autism = 'Autism spectrum',
  'Gender dysphoria' = 'Gender dysphoria',
  'Trauma (including PTSD)' = 'Trauma (including PTSD)',
  Depression = 'Depressive d/o',
  'Bipolar spectrum' = 'Bipolar spectrum',
  'Anger management' = 'Anger management',
  OCD = 'OCD',
  'Personality d/o' = 'Personality d/o',
  'Substance use' = 'Substance use',
  Eating_Disorder = 'Eating d/o',
  'Psychosis (e.g. schizophrenia)' = 'Psychosis (e.g. schizophrenia)',
  'Dissociative d/o' = 'Dissociative d/o',
  'Developmental delay' = 'Developmental delay',
  'Traumatic brain injury' = 'Traumatic brain injury'
}

export const ClinicalFocusSchema = z.array(z.nativeEnum(ClinicalFocus));
