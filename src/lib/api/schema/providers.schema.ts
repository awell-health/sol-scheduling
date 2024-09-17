import { z } from 'zod';
import { errorSchema } from './shared.schema';
import { Event } from './availabilities.schema';
import {
  AgeSchema,
  ClinicalFocusSchema,
  DeliveryMethodSchema,
  EthnicitySchema,
  LocationFacilitySchema,
  GenderSchema,
  LanguageSchema,
  TherapeuticModalitySchema,
  LocationStateSchema
} from './atoms';
import { isNil } from 'lodash-es';

/**
 * All parameters are optional
 */
export const GetProvidersInputSchema = z.object({
  age: AgeSchema.optional(),
  gender: GenderSchema.optional(),
  ethnicity: EthnicitySchema.optional(),
  // Not implemented
  language: LanguageSchema.optional(),
  therapeuticModality: TherapeuticModalitySchema.optional(),
  clinicalFocus: ClinicalFocusSchema.optional(),
  deliveryMethod: DeliveryMethodSchema.optional(),
  location: z
    .object({
      // Not implemented
      facility: LocationFacilitySchema.optional(),
      state: LocationStateSchema.optional()
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
        gender: GenderSchema.optional(),
        ethnicity: EthnicitySchema.optional(),
        // Not implemented
        // language: z.string().optional(),
        location: z
          .object({
            // Not implemented
            facility: z.string().optional(),
            state: LocationStateSchema.optional()
          })
          .optional(),
        name: z.string(),
        id: z.string(), // Data warehouse ID
        clinicalFocus: z.array(z.string()).optional(),
        bio: z.string().optional(),
        image: z.string().optional(),
        events: z
          .array(Event)
          .optional()
          .transform((e) => {
            if (isNil(e) || e.length === 0) return [];
            return e;
          })
      })
    )
  })
  .merge(errorSchema);

export type GetProvidersResponseType = z.infer<
  typeof GetProvidersResponseSchema
>;
