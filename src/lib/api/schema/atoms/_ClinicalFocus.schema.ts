import { z } from 'zod';

export enum ClinicalFocus {
  ADHD = 'ADHD',
  Anxiety = 'Anxiety d/o',
  Autism = 'Autism spectrum',
  GenderDysphoria = 'Gender dysphoria',
  Trauma = 'Trauma (including PTSD)',
  Depression = 'Depressive d/o',
  BipolarSpectrum = 'Bipolar spectrum',
  AngerManagement = 'Anger management',
  OCD = 'OCD',
  PersonalityDO = 'Personality d/o',
  SubstanceUse = 'Substance use',
  EatingDisorder = 'Eating d/o',
  Psychosis = 'Psychosis (e.g. schizophrenia)',
  DissociativeDO = 'Dissociative d/o',
  DevelopmentalDelal = 'Developmental delay',
  TraumaticBrainInjury = 'Traumatic brain injury'
}

export const ClinicalFocusSchema = z.array(z.nativeEnum(ClinicalFocus));
