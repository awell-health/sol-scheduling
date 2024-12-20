import { z } from 'zod';
import { errorSchema } from './shared.schema';

export const BookAppointmentInputSchema = z.object({
  eventId: z.string(),
  providerId: z.string(),
  userInfo: z.object({
    userName: z.string()
  }),
  locationType: z.string()
});

export type BookAppointmentInputType = z.infer<
  typeof BookAppointmentInputSchema
>;

export const BookAppointmentResponseSchema = z
  .object({
    data: z.unknown()
  })
  .merge(errorSchema);

export type BookAppointmentResponseType = z.infer<
  typeof BookAppointmentResponseSchema
>;
