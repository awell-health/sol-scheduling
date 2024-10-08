import { z } from 'zod';

export enum ClinicalFocus {
  'ADHD' = 'ADHD',
  'Anger Management' = 'Anger Management',
  'Anxiety' = 'Anxiety',
  'Autism (ASD)' = 'Autism (ASD)',
  'Bipolar Disorder' = 'Bipolar Disorder',
  'Depression' = 'Depression',
  'Developmental Disorders' = 'Developmental Disorders',
  'Eating Disorder' = 'Eating Disorder',
  'Grief & Loss' = 'Grief & Loss',
  'Identity Issues' = 'Identity Issues',
  'Life Transitions' = 'Life Transitions',
  'OCD' = 'OCD',
  'Relationship Issues' = 'Relationship Issues',
  'Stress Management' = 'Stress Management',
  'Substance Use' = 'Substance Use',
  'Trauma & PTSD' = 'Trauma & PTSD'
}

export const ClinicalFocusSchema = z.array(z.nativeEnum(ClinicalFocus));
