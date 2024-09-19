import { expect, describe, it } from '@jest/globals';

import { getFacilitiesByState, getStateCodeByFacility } from './locationUtils';
import { LocationFacility, LocationState } from '../../api/schema';

describe('Utility Functions for Location and Facility', () => {
  describe('getFacilitiesByState', () => {
    it('should return facilities for Colorado (CO)', () => {
      const facilities = getFacilitiesByState(LocationState.CO);
      expect(facilities).toEqual([
        LocationFacility.CherryCreek,
        LocationFacility.GreenwoodVillage,
        LocationFacility.CentralPark,
        LocationFacility.Lakewood,
        LocationFacility.Boulder,
        LocationFacility.HighlandsRanch,
        LocationFacility.Broomfield,
        LocationFacility.Parker
      ]);
    });

    it('should return facilities for Maryland (MD)', () => {
      const facilities = getFacilitiesByState(LocationState.MD);
      expect(facilities).toEqual([
        LocationFacility.Gaithersburg,
        LocationFacility.Frederick,
        LocationFacility.Ballston,
        LocationFacility.Downtown,
        LocationFacility.Tysons,
        LocationFacility.SilverSpring
      ]);
    });

    it('should return an empty array for Virginia (VA)', () => {
      const facilities = getFacilitiesByState(LocationState.VA);
      expect(facilities).toEqual([]);
    });

    it('should return an empty array for District of Columbia (DC)', () => {
      const facilities = getFacilitiesByState(LocationState.DC);
      expect(facilities).toEqual([]);
    });

    it('should return facilities for New York (NY)', () => {
      const facilities = getFacilitiesByState(LocationState.NY);
      expect(facilities).toEqual([
        LocationFacility.BrooklynHeights,
        LocationFacility.UnionSquare,
        LocationFacility.LongIslandCity,
        LocationFacility.ColumbusCircle,
        LocationFacility.Williamsburg,
        LocationFacility.WallStreet,
        LocationFacility.Astoria,
        LocationFacility.Gowanus,
        LocationFacility.MidtownEast,
        LocationFacility.Manhasset,
        LocationFacility.Melville,
        LocationFacility.ValleyStream,
        LocationFacility.Massapequa
      ]);
    });

    it('should return facilities for Texax (TX)', () => {
      const facilities = getFacilitiesByState(LocationState.TX);
      expect(facilities).toEqual([
        LocationFacility.Woodlands,
        LocationFacility.UpperKirby,
        LocationFacility.Austin
      ]);
    });
  });

  describe('getStateByFacility', () => {
    it('should return the correct state for Cherry Creek facility', () => {
      const state = getStateCodeByFacility(LocationFacility.CherryCreek);
      expect(state).toBe('CO');
    });

    it('should return the correct state for Gaithersburg facility', () => {
      const state = getStateCodeByFacility(LocationFacility.Gaithersburg);
      expect(state).toBe('MD');
    });

    it('should return the correct state for Brooklyn Heights facility', () => {
      const state = getStateCodeByFacility(LocationFacility.BrooklynHeights);
      expect(state).toBe('NY');
    });

    it('should return the correct state for Austin facility', () => {
      const state = getStateCodeByFacility(LocationFacility.Austin);
      expect(state).toBe('TX');
    });

    it('should return undefined for a non-existent facility', () => {
      const state = getStateCodeByFacility(
        'NonExistentFacility' as LocationFacility
      );
      expect(state).toBeUndefined();
    });
  });
});
