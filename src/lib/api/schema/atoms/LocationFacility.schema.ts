import { z } from 'zod';

export enum LocationFacility {
  CherryCreek = 'CO - Cherry Creek',
  GreenwoodVillage = 'CO - Greenwood Village',
  CentralPark = 'CO - Central Park',
  Lakewood = 'CO - Lakewood',
  Boulder = 'CO - Boulder',
  HighlandsRanch = 'CO - Highlands Ranch',
  Broomfield = 'CO - Broomfield',
  Parker = 'CO - Parker',
  SilverSpring = 'MD - Silver Spring',
  Gaithersburg = 'MD - Gaithersburg',
  Frederick = 'MD - Frederick',
  Downtown = 'MD - Downtown',
  Ballston = 'MD - Ballston',
  Tysons = 'MD - Tysons',
  BrooklynHeights = 'NY - Brooklyn Heights',
  UnionSquare = 'NY - Union Square',
  LongIslandCity = 'NY - Long Island City',
  ColumbusCircle = 'NY - Columbus Circle',
  Williamsburg = 'NY - Williamsburg',
  WallStreet = 'NY - Wall Street',
  Astoria = 'NY - Astoria',
  Gowanus = 'NY - Gowanus',
  MidtownEast = 'NY - Midtown East',
  Manhasset = 'NY - Manhasset',
  Melville = 'NY - Melville',
  ValleyStream = 'NY - Valley Stream',
  Massapequa = 'NY - Massapequa',
  Woodlands = 'TX - Woodlands',
  UpperKirby = 'TX - Upper Kirby',
  Austin = 'TX - Austin'
}

export const LocationFacilitySchema = z
  .union([
    z.nativeEnum(LocationFacility),
    z.literal('') // Explicitly accepts an empty string
  ])
  .optional()
  .transform((value) => {
    if (value === undefined || value.length === 0) {
      return undefined;
    }
    return value as LocationFacility;
  });
