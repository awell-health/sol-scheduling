import { z } from 'zod';
import { errorSchema } from './shared.schema';
import { Event } from './availabilities.schema';

const ageSchema = z.coerce.string(); // Both number and string will work
export const genderSchema = z.enum(['M', 'F', 'Non-binary/non-conforming']);
const ethnicitySchema = z.enum([
  'Asian',
  'Black or African American',
  'Hispanic or Latinx',
  'White',
  'Other'
]);
const languageSchema = z.string();
const therapeuticModality = z.enum(['Psychiatric', 'Therapy']);
const clinicalFocusSchema = z.array(
  z.enum([
    'ADHD',
    'Anxiety d/o',
    'Autism spectrum',
    'Gender dysphoria',
    'Trauma (including PTSD)',
    'Depressive d/o',
    'Bipolar spectrum',
    'Anger management',
    'OCD',
    'Personality d/o',
    'Substance use',
    'Eating d/o',
    'Psychosis (e.g. schizophrenia)',
    'Dissociative d/o',
    'Developmental delay',
    'Traumatic brain injury'
  ])
);
const deliveryMethodSchema = z.enum(['virtual', 'in-person']);
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
  gender: genderSchema.optional(),
  ethnicity: ethnicitySchema.optional(),
  // Not implemented
  language: languageSchema.optional(),
  therapeuticModality: therapeuticModality.optional(),
  clinicalFocus: clinicalFocusSchema.optional(),
  deliveryMethod: deliveryMethodSchema.optional(),
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
        gender: genderSchema.optional(),
        ethnicity: ethnicitySchema.optional(),
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
