import { z } from 'zod';

export const AgeSchema = z.coerce.string(); // Both number and string will work
