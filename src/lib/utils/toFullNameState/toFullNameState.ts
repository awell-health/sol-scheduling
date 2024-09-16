import { supportedStates } from '../../api/providers.schema';
import { z } from 'zod';

const stateNameMap: Record<z.infer<typeof supportedStates>, string> = {
  CO: 'Colorado',
  NY: 'New York',
  TX: 'Texas',
  VA: 'Virginia',
  MD: 'Maryland',
  DC: 'District of Columbia'
};

export const toFullNameState = (shortHandState: string): string => {
  try {
    const validState = supportedStates.parse(shortHandState);
    return stateNameMap[validState];
  } catch {
    return shortHandState;
  }
};
