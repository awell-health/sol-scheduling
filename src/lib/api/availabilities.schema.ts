import { z } from 'zod';
import { errorSchema, ISO8601DateStringSchema } from './shared.schema';

export const GetAvailabilitiesInputSchema = z.object({
  providerId: z.array(z.string())
});

export type GetAvailabilitiesInputType = z.infer<
  typeof GetAvailabilitiesInputSchema
>;

export const Event = z.object({
  eventId: z.string(),
  date: ISO8601DateStringSchema,
  providerId: z.string(),
  slotstart: ISO8601DateStringSchema,
  duration: z.number(),
  facility: z.string()
});

export const GetAvailabilitiesResponseSchema = z
  .object({
    data: z.record(z.string(), z.array(Event))
  })
  .merge(errorSchema);

export type GetAvailabilitiesResponseType = z.infer<
  typeof GetAvailabilitiesResponseSchema
>;
