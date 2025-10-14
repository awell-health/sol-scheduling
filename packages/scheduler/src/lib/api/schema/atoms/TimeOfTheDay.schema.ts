import { z } from 'zod';

export enum TimeOfTheDay {
  'Morning' = 'Morning',
  'Afternoon' = 'Afternoon',
  'Evening' = 'Evening'
}

export const TimeOfTheDaySchema = z.nativeEnum(TimeOfTheDay).optional();
