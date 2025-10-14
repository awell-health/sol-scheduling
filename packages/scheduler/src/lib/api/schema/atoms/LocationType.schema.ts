import { z } from 'zod';

/**
 * The confirmed location for a booked event
 */
export enum LocationType {
  'Telehealth' = 'Telehealth',
  'InPerson' = 'In-Person'
}

export const LocationTypeSchema = z.nativeEnum(LocationType);

export type LocationTypeType = z.infer<typeof LocationTypeSchema>;
