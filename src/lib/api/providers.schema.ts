import { z } from 'zod';
import { errorSchema } from './shared.schema';

const ageSchema = z.string();
export const genderSchema = z.enum(['M', 'F']);
const ethnicitySchema = z.enum(['Hispanic', 'White', 'African American']);
const languageSchema = z.enum(['en', 'sp', 'fr', 'de', 'it']);
const therapeuticModality = z.enum(['Psychiatric', 'Therapy']);
const clinicalFocusSchema = z.array(
  z.enum(['ADHD', 'Anxiety d/o', 'Autism spectrum', 'Gender dysphoria'])
);
const deliveryMethodSchema = z.enum(['virtual', 'in-person']);
const facilitySchema = z.enum(['f1', 'f2', 'f3']); // "f1" = "Broomfield", "f2" = "Colorado", "f3" = "New York".
export const stateSchema = z.enum(['CO', 'NY', 'TX', 'VA', 'MD', 'DC']);

export const GetProvidersInputSchema = z.object({
  age: ageSchema.optional(),
  gender: genderSchema.optional(),
  ethnicity: ethnicitySchema.optional(),
  language: languageSchema.optional(), // Not implemented
  therapeuticModality: therapeuticModality.optional(),
  clinicalFocus: clinicalFocusSchema.optional(),
  deliveryMethod: deliveryMethodSchema.optional(),
  location: z
    .object({
      facility: facilitySchema.optional(), // Not implemented
      state: stateSchema.optional()
    })
    .optional()
});

export type GetProvidersInputType = z.infer<typeof GetProvidersInputSchema>;

export const GetProvidersResponseSchema = z
  .object({
    data: z.array(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        id: z.string(), // Data warehouse ID
        gender: genderSchema,
        ethnicity: ethnicitySchema,
        clinicalFocus: z.array(z.string()),
        language: z.string().optional(), // Not implemented
        location: z.object({
          facility: z.string().optional(), // Not implemented
          state: stateSchema
        })
      })
    )
  })
  .merge(errorSchema);

export type GetProvidersResponseType = z.infer<
  typeof GetProvidersResponseSchema
>;
