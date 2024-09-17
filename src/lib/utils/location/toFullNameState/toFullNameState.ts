import { z } from 'zod';
import { LocationStateSchema } from '../../../api';

const stateNameMap: Record<z.infer<typeof LocationStateSchema>, string> = {
  CO: 'Colorado',
  NY: 'New York',
  TX: 'Texas',
  VA: 'Virginia',
  MD: 'Maryland',
  DC: 'District of Columbia'
};

export const toFullNameState = (shortHandState: string): string => {
  try {
    const validState = LocationStateSchema.parse(shortHandState);
    return stateNameMap[validState];
  } catch {
    return shortHandState;
  }
};
