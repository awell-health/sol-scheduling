import { z } from 'zod';

export const ISO8601DateStringSchema = z.coerce.date();

export const errorSchema = z.object({
  error: z.string().optional(),
  errorCode: z.string().optional()
});
