import { z } from 'zod';
import { errorSchema } from './shared.schema';
import { Event } from './availabilities.schema';

const ageSchema = z.coerce.string(); // Both number and string will work

export enum Gender {
  Male = 'M',
  Female = 'F',
  'Non-binary/non-conforming' = 'Non-binary/non-conforming'
}
export const Genders = z.nativeEnum(Gender);

export enum Ethnicity {
  'Asian' = 'Asian',
  'Black or African American' = 'Black or African American',
  'Hispanic or Latinx' = 'Hispanic or Latinx',
  'White' = 'White',
  'Other' = 'Other'
}
export const Ethnicities = z.nativeEnum(Ethnicity);

export enum Modality {
  'Psychiatric' = 'Psychiatric',
  'Therapy' = 'Therapy'
}
export const Modalities = z.nativeEnum(Modality);

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
export const ClinicalFoci = z.array(z.nativeEnum(ClinicalFocus));

export enum DeliveryMethod {
  'Virtual' = 'virtual',
  'In-person' = 'in-person'
}
export const DeliveryMethods = z.nativeEnum(DeliveryMethod);

const languageSchema = z.string();
const facilitySchema = z.enum(['f1', 'f2', 'f3']); // "f1" = "Broomfield", "f2" = "Colorado", "f3" = "New York".

/**
 * The back-end can receive any string (no validation) but the front-end needs to display
 * a list of supported states
 */
export const stateSchema = z.enum(['CO', 'NY', 'TX', 'VA', 'MD', 'DC']);

/**
 * All parameters are optional
 */
export const GetProvidersInputSchema = z.object({
  age: ageSchema.optional(),
  gender: Genders.optional(),
  ethnicity: Ethnicities.optional(),
  // Not implemented
  language: languageSchema.optional(),
  therapeuticModality: Modalities.optional(),
  clinicalFocus: ClinicalFoci.optional(),
  deliveryMethod: DeliveryMethods.optional(),
  location: z
    .object({
      // Not implemented
      facility: facilitySchema.optional(),
      state: stateSchema.optional()
    })
    .optional()
});

export type GetProvidersInputType = z.infer<typeof GetProvidersInputSchema>;

/**
 * Marking some fields as optional to enforce
 * defensive programming in the front-end
 */
export const GetProvidersResponseSchema = z
  .object({
    data: z.array(
      z.object({
        gender: Genders.optional(),
        ethnicity: Ethnicities.optional(),
        // Not implemented
        // language: z.string().optional(),
        location: z
          .object({
            // Not implemented
            facility: z.string().optional(),
            state: stateSchema.optional()
          })
          .optional(),
        name: z.string(),
        id: z.string(), // Data warehouse ID
        clinicalFocus: z.array(z.string()).optional(),
        bio: z.string().optional(),
        image: z.string().optional(),
        events: z.array(Event).nullable()
      })
    )
  })
  .merge(errorSchema);

export type GetProvidersResponseType = z.infer<
  typeof GetProvidersResponseSchema
>;
