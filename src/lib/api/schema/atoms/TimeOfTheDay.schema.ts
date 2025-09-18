import { z } from 'zod';

export enum TimeOfTheDay {
  'Morning' = 'Morning',
  'Afternoon' = 'Afternoon',
  'Evening' = 'Evening'
}

export const TimeOfTheDaySchema = z
  .nativeEnum(TimeOfTheDay)
  .optional()
  .transform((value) => {
    if (value === TimeOfTheDay.Morning) {
      return 'Morning';
    } else if (value === TimeOfTheDay.Afternoon) {
      return 'Afternoon';
    } else if (value === TimeOfTheDay.Evening) {
      return 'Evening';
    } else {
      return undefined;
    }
  });
