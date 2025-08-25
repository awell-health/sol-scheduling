import { z } from 'zod';
import { errorSchema } from './shared.schema';

export const BookAppointmentInputSchema = z.object({
  eventId: z.string(),
  providerId: z.string(),
  userInfo: z.object({
    userName: z.string(),
    salesforceLeadId: z.string().optional()
  }),
  locationType: z.string()
});

export type BookAppointmentInputType = z.infer<
  typeof BookAppointmentInputSchema
>;

export const BookAppointmentResponseSchema = z
  .object({
    data: z.object({
      salesforceLeadId: z.string().optional(),
      magicLink: z.string().optional(),
    }).optional()
  })
  .merge(errorSchema);

export type BookAppointmentResponseType = z.infer<
  typeof BookAppointmentResponseSchema
>;
