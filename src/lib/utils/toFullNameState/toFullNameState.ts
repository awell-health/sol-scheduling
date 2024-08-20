import { stateSchema } from '../../api/providers.schema';
import { z } from 'zod';

const stateNameMap: Record<z.infer<typeof stateSchema>, string> = {
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
    const validState = stateSchema.parse(shortHandState);
    return stateNameMap[validState];
  } catch {
    return shortHandState;
  }
};
