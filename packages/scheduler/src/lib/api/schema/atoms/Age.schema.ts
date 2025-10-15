import { z } from 'zod';

const MIN_AGE = 6;

export const AgeSchema = z.coerce
  .number() // Coerce both strings and numbers to numbers
  .transform((value) => {
    if (value < MIN_AGE) {
      return undefined;
    }

    // Make sure it's a string again in the end because API expects it as a string
    return String(value);
  });
