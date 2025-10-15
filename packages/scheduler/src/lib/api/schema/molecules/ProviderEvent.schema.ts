import { z } from 'zod';
import { ISO8601DateStringSchema } from '../shared.schema';
import { DeliveryMethodSchema, EventDeliveryMethodSchema } from '../atoms';

export const ProviderEventSchema = z.object({
  eventId: z.string(),
  date: ISO8601DateStringSchema,
  providerId: z.string(),
  slotstart: ISO8601DateStringSchema,
  duration: z.number(),
  facility: z.string(),
  location: EventDeliveryMethodSchema.optional(),
  eventType: DeliveryMethodSchema,
  booked: z.boolean().optional()
});
