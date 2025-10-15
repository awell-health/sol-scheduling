import { z } from 'zod';
import { LocationStateSchema } from '../atoms';

export const ProviderSchema = z.object({
  id: z.string(), // Resource ID of the provider
  location: z
    .object({
      facility: z.string().optional(),
      state: LocationStateSchema.optional()
    })
    .optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  profileLink: z.string().optional()
});
