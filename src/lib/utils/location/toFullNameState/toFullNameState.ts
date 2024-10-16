import { LocationStateSchema, LocationStateToNameMapping } from '../../../api';

export const toFullNameState = (
  shortHandState?: string
): string | undefined => {
  try {
    const validState = LocationStateSchema.parse(shortHandState);
    if (validState) {
      return LocationStateToNameMapping[validState];
    } else {
      return undefined;
    }
  } catch {
    return shortHandState;
  }
};
