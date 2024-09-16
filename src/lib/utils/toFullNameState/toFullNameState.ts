import { supportedStates } from '../../api/providers.schema';
import { z } from 'zod';

const stateNameMap: Record<z.infer<typeof supportedStates>, string> = {
  AL: 'Alabama',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  FL: 'Florida',
  KS: 'Kansas',
  MD: 'Maryland',
  ME: 'Maine',
  MN: 'Minnesota',
  NC: 'North Carolina',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  PA: 'Pennsylvania',
  TX: 'Texas',
  VA: 'Virginia',
  WY: 'Wyoming'
};

export const toFullNameState = (shortHandState: string): string => {
  try {
    const validState = supportedStates.parse(shortHandState);
    return stateNameMap[validState];
  } catch {
    return shortHandState;
  }
};
