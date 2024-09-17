import { z } from 'zod';

export enum LocationState {
  CO = 'CO',
  NY = 'NY',
  TX = 'TX',
  VA = 'VA',
  MD = 'MD',
  DC = 'DC'
}

/**
 * The back-end can receive any string (no validation) but the front-end needs to display
 * a list of supported states
 */
export const LocationStateSchema = z.nativeEnum(LocationState);
