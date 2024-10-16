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
  Gaithersburg = 'MD - Gaithersburg',
  Frederick = 'MD - Frederick',
  Ballston = 'MD - Ballston',
  Downtown = 'MD - Downtown',
  Tysons = 'MD - Tysons',
  SilverSpring = 'MD - Silver Spring',
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
  .nativeEnum(LocationFacility)
  .optional()
  .transform((value) => {
    if (value === undefined || value.length === 0) {
      return undefined;
    }
    return value as LocationFacility;
  });
