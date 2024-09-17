import { Genders } from '../../api/providers.schema';
import { z } from 'zod';

const genderNameMap: Record<z.infer<typeof Genders>, string> = {
  M: 'Male',
  F: 'Female',
  'Non-binary/non-conforming': 'Non-binary/non-conforming'
};

export const toFullNameGender = (shortHandGender: string): string => {
  try {
    const validGender = Genders.parse(shortHandGender);
    return genderNameMap[validGender];
  } catch {
    return shortHandGender;
  }
};
