import { z } from 'zod';
import { errorSchema, ISO8601DateStringSchema } from './shared.schema';
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
      facility: LocationFacilitySchema.optional(),
      state: LocationStateSchema.optional()
    })
    .optional()
});

export type GetProvidersInputType = z.infer<typeof GetProvidersInputSchema>;

export const ProviderEvent = z.object({
  eventId: z.string(),
  slotstart: ISO8601DateStringSchema,
  providerId: z.string(),
  date: ISO8601DateStringSchema,
  duration: z.number(),
  booked: z.boolean().optional(),
  eventType: DeliveryMethodSchema,
  facility: z.string()
});

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
            facility: z.string().optional(),
            state: LocationStateSchema.optional()
          })
          .optional(),
        firstName: z.string(),
        lastName: z.string(),
        id: z.string(), // Data warehouse ID
        clinicalFocus: z.array(z.string()).optional(),
        bio: z.string().optional(),
        image: z.string().optional(),
        profileLink: z.string().optional(),
        events: z
          .array(ProviderEvent)
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
