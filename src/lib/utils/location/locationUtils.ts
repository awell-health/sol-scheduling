import {
  LocationFacility,
  LocationState,
  LocationStateToNameMapping
} from '../../api/schema';

export const stateToFacilitiesMap: Record<LocationState, LocationFacility[]> = {
  CO: [
    LocationFacility.CherryCreek,
    LocationFacility.GreenwoodVillage,
    LocationFacility.CentralPark,
    LocationFacility.Lakewood,
    LocationFacility.Boulder,
    LocationFacility.HighlandsRanch,
    LocationFacility.Broomfield,
    LocationFacility.Parker
  ],
  MD: [
    LocationFacility.Gaithersburg,
    LocationFacility.Frederick,
    LocationFacility.SilverSpring
  ],
  NY: [
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
  ],
  TX: [
    LocationFacility.Woodlands,
    LocationFacility.UpperKirby,
    LocationFacility.Austin
  ],
  VA: [LocationFacility.Ballston, LocationFacility.Tysons],
  DC: [LocationFacility.Downtown]
};

export function getFacilitiesByState(
  state: keyof typeof stateToFacilitiesMap
): LocationFacility[] {
  return stateToFacilitiesMap[state] || [];
}

// Utility function to get the state by facility
export function getStateCodeByFacility(
  facility: LocationFacility
): string | undefined {
  return facility.toUpperCase() as LocationState;
}

export function getStateNameByFacility(
  facility: LocationFacility
): string | undefined {
  const state = getStateCodeByFacility(facility);
  return state ? LocationStateToNameMapping[state as LocationState] : undefined;
}
