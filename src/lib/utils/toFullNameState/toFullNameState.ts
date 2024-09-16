import { stateSchema } from '../../api/providers.schema';
import { z } from 'zod';

const stateNameMap: Record<z.infer<typeof stateSchema>, string> = {
  CO: 'Colorado',
  NY: 'New York',
  TX: 'Texas',
  VA: 'Virginia',
  MD: 'Maryland',
  DC: 'District of Columbia'
};

export const toFullNameState = (shortHandState: string): string => {
  try {
    const validState = stateSchema.parse(shortHandState);
    return stateNameMap[validState];
  } catch {
    return shortHandState;
  }
};
