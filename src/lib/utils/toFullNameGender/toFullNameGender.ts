import { GenderSchema } from '../../api/schema';
import { z } from 'zod';

const genderNameMap: Record<z.infer<typeof GenderSchema>, string> = {
  M: 'Male',
  F: 'Female',
  'Non-binary/non-conforming': 'Non-binary/non-conforming'
};

export const toFullNameGender = (shortHandGender: string): string => {
  try {
    const validGender = GenderSchema.parse(shortHandGender);
    return genderNameMap[validGender];
  } catch {
    return shortHandGender;
  }
};
