import { z } from 'zod';

export enum LocationFacility {
  CherryCreek = 'Cherry Creek',
  GreenwoodVillage = 'Greenwood Village',
  CentralPark = 'Central Park',
  Lakewood = 'Lakewood',
  Boulder = 'Boulder',
  HighlandsRanch = 'Highlands Ranch',
  Broomfield = 'Broomfield',
  Parker = 'Parker',
  Gaithersburg = 'Gaithersburg',
  Frederick = 'Frederick',
  Ballston = 'Ballston',
  Downtown = 'Downtown',
  Tysons = 'Tysons',
  SilverSpring = 'Silver Spring',
  BrooklynHeights = 'Brooklyn Heights',
  UnionSquare = 'Union Square',
  LongIslandCity = 'Long Island City',
  ColumbusCircle = 'Columbus Circle',
  Williamsburg = 'Williamsburg',
  WallStreet = 'Wall Street',
  Astoria = 'Astoria',
  Gowanus = 'Gowanus',
  MidtownEast = 'Midtown East',
  Manhasset = 'Manhasset',
  Melville = 'Melville',
  ValleyStream = 'Valley Stream',
  Massapequa = 'Massapequa',
  Woodlands = 'Woodlands',
  UpperKirby = 'Upper Kirby',
  Austin = 'Austin'
}

export const LocationFacilitySchema = z.nativeEnum(LocationFacility);
