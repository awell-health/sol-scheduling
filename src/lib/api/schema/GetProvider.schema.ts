import { z } from 'zod';
import { errorSchema } from './shared.schema';

export const GetProviderInputSchema = z.object({
  providerId: z.string().min(1)
  // wordpressId - I'm not including wordpressId here as we can assume the Scheduling experience always works with the resource ID
});

export type GetProviderInputType = z.infer<typeof GetProviderInputSchema>;

/**
 * Marking some fields as optional to enforce
 * defensive programming in the front-end
 */
export const GetProviderResponseSchema = z
  .object({
    data: z.object({
      id: z.string(), // Resource ID of the provider
      location: z
        .object({
          facility: z.string().optional(),
          state: z.string().optional()
        })
        .optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      bio: z.string().optional(),
      image: z.string().optional(),
      profileLink: z.string().optional()
    })
  })
  .merge(errorSchema);

export type GetProviderResponseType = z.infer<typeof GetProviderResponseSchema>;
