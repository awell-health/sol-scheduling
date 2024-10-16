import { z } from 'zod';

export enum LocationState {
  CO = 'CO',
  NY = 'NY',
  TX = 'TX',
  VA = 'VA',
  MD = 'MD',
  DC = 'DC'
}

export const LocationStateToNameMapping: Record<LocationState, string> = {
  CO: 'Colorado',
  NY: 'New York',
  TX: 'Texas',
  VA: 'Virginia',
  MD: 'Maryland',
  DC: 'Washington DC'
};

/**
 * The back-end can receive an empty string but the front-end needs to display
 * a list of supported states
 */
export const LocationStateSchema = z
  .nativeEnum(LocationState)
  .optional()
  .transform((value) => {
    if (value === undefined || value.length === 0) {
      return undefined;
    }
    return value as LocationState;
  });
