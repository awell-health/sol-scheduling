import { z } from 'zod';
import { errorSchema } from './shared.schema';

export const GetProviderInputSchema = z.object({
  providerId: z.string().min(1)
});

export type GetProviderInputType = z.infer<typeof GetProviderInputSchema>;

/**
 * Marking some fields as optional to enforce
 * defensive programming in the front-end
 */
export const GetProviderResponseSchema = z
  .object({
    data: z.object({
      location: z
        .object({
          facility: z.string().optional(),
          state: z.string().optional()
        })
        .optional(),
      name: z.string().optional(),
      bio: z.string().optional(),
      image: z.string().optional(),
      profileLink: z.string().optional()
    })
  })
  .merge(errorSchema);

export type GetProviderResponseType = z.infer<typeof GetProviderResponseSchema>;
