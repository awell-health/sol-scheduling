import { z } from 'zod';
import { errorSchema } from './shared.schema';

export const GetProvidersInputSchema = z.object({
  agePreference: z.string(),
  gender: z.enum(['M', 'F']),
  ethnicity: z.string(),
  language: z.string(),
  therapeuticModality: z.enum(['Psychiatry', 'therapy', 'both', 'not sure']),
  clinicalFocus: z.array(z.string()),
  deliveryMethod: z.enum(['virtual', 'in-person', 'hybrid']),
  location: z.object({
    facility: z.string(),
    state: z.string()
  })
});

export type GetProvidersInputType = z.infer<typeof GetProvidersInputSchema>;

export const GetProvidersResponseSchema = z
  .object({
    data: z.array(
      z.object({
        name: z.string().min(1),
        providerId: z.string().min(1),
        providerResourceId: z.string().optional(),
        gender: z.string().optional(),
        ethnicity: z.string().optional(),
        language: z.string().optional(),
        location: z.string()
      })
    )
  })
  .merge(errorSchema);

export type GetProvidersResponseType = z.infer<
  typeof GetProvidersResponseSchema
>;
