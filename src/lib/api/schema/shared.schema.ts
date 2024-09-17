import { z } from 'zod';

import { GetAvailabilitiesResponseType } from '..';

export type SlotType = Pick<
  GetAvailabilitiesResponseType['data'][string][number],
  'slotstart' | 'eventId' | 'duration' | 'providerId'
>;

export const ISO8601DateStringSchema = z.coerce.date();

export const errorSchema = z.object({
  errorMessage: z.string().optional(),
  errorCode: z.string().optional()
});
