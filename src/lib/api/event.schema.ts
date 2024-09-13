import { z } from 'zod';
import { errorSchema } from './shared.schema';

/**
 * This is used in the private extension
 * https://github.com/awell-health/extension-sol
 */

/**
 * WIP - likely to change
 * Pending their API docs
 */
export const GetEventInputSchema = z.object({
  eventId: z.string().min(1),
  providerId: z.string().min(1)
});

export type GetEventInputType = z.infer<typeof GetEventInputSchema>;

/**
 * WIP - likely to change
 * Pending their API docs
 */
export const GetEventResponseSchema = z
  .object({
    id: z.string(),
    summary: z.string(),
    date: z.string(),
    eventId: z.string(),
    slotstart: z.date(),
    duration: z.number(),
    booked: z.boolean(),
    eventType: z.string()
  })
  .merge(errorSchema);

export type GetEventResponseType = z.infer<typeof GetEventResponseSchema>;
