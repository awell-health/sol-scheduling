import { z } from 'zod';
import { errorSchema } from './shared.schema';
import { ProviderEventSchema } from './molecules/ProviderEvent.schema';

export const GetAvailabilitiesInputSchema = z.object({
  providerId: z.array(z.string())
});

export type GetAvailabilitiesInputType = z.infer<
  typeof GetAvailabilitiesInputSchema
>;

export const GetAvailabilitiesResponseSchema = z
  .object({
    data: z.record(z.string(), z.array(ProviderEventSchema))
  })
  .merge(errorSchema);

export type GetAvailabilitiesResponseType = z.infer<
  typeof GetAvailabilitiesResponseSchema
>;
