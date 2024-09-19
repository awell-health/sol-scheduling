import { LocationFacility, LocationState } from '../../api/schema';

const stateToFacilitiesMap: Record<LocationState, LocationFacility[]> = {
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
    LocationFacility.Ballston,
    LocationFacility.Downtown,
    LocationFacility.Tysons,
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
  VA: [
    LocationFacility.Gaithersburg,
    LocationFacility.Frederick,
    LocationFacility.Ballston,
    LocationFacility.Downtown,
    LocationFacility.Tysons,
    LocationFacility.SilverSpring
  ],
  DC: [
    LocationFacility.Gaithersburg,
    LocationFacility.Frederick,
    LocationFacility.Ballston,
    LocationFacility.Downtown,
    LocationFacility.Tysons,
    LocationFacility.SilverSpring
  ]
};

const facilityToStateMap: Record<LocationFacility, string> = Object.entries(
  stateToFacilitiesMap
).reduce(
  (acc, [state, facilities]) => {
    facilities.forEach((facility) => {
      acc[facility] = state;
    });
    return acc;
  },
  {} as Record<LocationFacility, string>
);

export function getFacilitiesByState(
  state: keyof typeof stateToFacilitiesMap
): LocationFacility[] {
  return stateToFacilitiesMap[state] || [];
}

// Utility function to get the state by facility
export function getStateByFacility(
  facility: LocationFacility
): string | undefined {
  return facilityToStateMap[facility];
}
