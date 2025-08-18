import { z } from 'zod';
import { errorSchema } from './shared.schema';
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
import { isEmpty, isNil } from 'lodash-es';
import { ProviderEventSchema } from './molecules/ProviderEvent.schema';
import { ProviderSchema } from './molecules';

const transformEmptyToUndefined = <T extends z.ZodType>(schema: T) =>
  schema.transform((v): z.infer<T> | undefined => (isEmpty(v) ? undefined : v));

export const GetProvidersInputSchema = z.object({
  age: transformEmptyToUndefined(AgeSchema).default(30), //REV-477: default to 30 because if age is not set, the API will retur no providers
  gender: transformEmptyToUndefined(GenderSchema).optional(),
  ethnicity: transformEmptyToUndefined(EthnicitySchema).optional(),
  // Not implemented
  language: transformEmptyToUndefined(LanguageSchema).optional(),
  therapeuticModality: transformEmptyToUndefined(
    TherapeuticModalitySchema
  ).optional(),
  clinicalFocus: transformEmptyToUndefined(ClinicalFocusSchema).optional(),
  deliveryMethod: transformEmptyToUndefined(DeliveryMethodSchema).optional(),
  location: z
    .object({
      facility: LocationFacilitySchema.optional(),
      state: LocationStateSchema.optional()
    })
    .optional()
    .transform((location) => {
      if (isNil(location) || isEmpty(location)) return undefined;
      const { facility, state } = location;
      if (!facility && !state) return undefined;
      return { facility, state };
    })
});

export type GetProvidersInputType = z.infer<typeof GetProvidersInputSchema>;

/**
 * Marking some fields as optional to enforce
 * defensive programming in the front-end
 */
export const GetProvidersResponseSchema = z
  .object({
    data: z.array(
      ProviderSchema.merge(
        z.object({
          events: z
            .array(ProviderEventSchema)
            .optional()
            .transform((e) => {
              if (isNil(e) || e.length === 0) return [];
              return e;
            })
        })
      )
    )
  })
  .merge(errorSchema);

export type GetProvidersResponseType = z.infer<
  typeof GetProvidersResponseSchema
>;
