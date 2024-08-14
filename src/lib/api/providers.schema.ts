import { z } from 'zod';
import { errorSchema } from './shared.schema';

const ethnicitySchema = z.enum(['Hispanic', 'Caucasian', 'African American']);
const languageSchema = z.enum(['en', 'sp', 'fr', 'de', 'it']);
const agePreferenceSchema = z.enum(['18-25', '26-50', '50-60']);
const genderSchema = z.enum(['M', 'F']);
const deliveryMethodSchema = z.enum(['Virtual', 'In-Person', 'Hybrid']);
const facilitySchema = z.enum(['f1', 'f2', 'f3']); // "f1" = "Broomfield", "f2" = "Colorado", "f3" = "New York".
const clinicalFocusSchema = z.array(
  z.enum(['Panic Disorder', 'Acute Stress', 'Generalized Anxiety'])
);
const therapeuticModality = z.enum(['Psychiatry', 'Therapy']);

export const GetProvidersInputSchema = z.object({
  agePreference: agePreferenceSchema,
  gender: genderSchema,
  ethnicity: ethnicitySchema,
  language: languageSchema,
  therapeuticModality: therapeuticModality,
  clinicalFocus: clinicalFocusSchema,
  deliveryMethod: deliveryMethodSchema,
  location: z.object({
    facility: facilitySchema,
    state: z.string()
  })
});

export type GetProvidersInputType = z.infer<typeof GetProvidersInputSchema>;

export const GetProvidersResponseSchema = z
  .object({
    data: z.array(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        Id: z.string().min(1),
        ResourceId: z.string().min(1),
        gender: genderSchema,
        ethnicity: ethnicitySchema,
        language: languageSchema,
        location: z.object({
          facility: facilitySchema,
          state: z.string().min(1)
        })
      })
    )
  })
  .merge(errorSchema);

export type GetProvidersResponseType = z.infer<
  typeof GetProvidersResponseSchema
>;
