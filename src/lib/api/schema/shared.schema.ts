import { z } from 'zod';

import { type LocationTypeType, type GetAvailabilitiesResponseType } from '..';

/**
 * An available slot
 * Location can be "Telehealth" or "In-Person"
 */
export type SlotType = Pick<
  GetAvailabilitiesResponseType['data'][string][number],
  'slotstart' | 'eventId' | 'duration' | 'providerId' | 'facility' | 'location'
>;

/**
 * When a slot is selected, we know the definitive location
 * which is "Telehealth" or "In-Person" and we store that
 * in "locationType"
 */
export type SlotWithConfirmedLocation = SlotType & {
  confirmedLocation: LocationTypeType;
};

export const ISO8601DateStringSchema = z.coerce.date();

export const errorSchema = z.object({
  errorMessage: z.string().optional(),
  errorCode: z.string().optional()
});
