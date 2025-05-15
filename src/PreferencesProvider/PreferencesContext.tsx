import React, {
  type FC,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  type LocationTypeType,
  type GetProvidersInputType,
  type GetProvidersResponseType,
  type SlotType
} from '../lib/api';
import {
  preferencesToFiltersArray,
  updatePreferencesWithFilters
} from './utils';
import {
  FilterType,
  FilterEnum,
  FilterKey
} from '../atoms/ProviderSelection/types';
import { useSolApi } from '../SolApiProvider';

type BookingInformation = {
  providerId: string | null;
  slot?: SlotType; // The slot the patient picked
  location?: {
    confirmedLocation?: LocationTypeType; // The location the patient picked for the slot (TeleHealth or In-Person)
    facility?: string;
  };
  preferences: GetProvidersInputType;
};

type PreferencesContextType = {
  preferences: GetProvidersInputType;
  filters: FilterType<FilterEnum>[];
  updateFilter: (filter: FilterType<FilterEnum>) => void;
  activeFilter: FilterKey | null;
  setActiveFilter: (newFilterKey: FilterKey | null) => void;
  getActiveFilter: () => FilterType<FilterEnum>;
  providers: GetProvidersResponseType['data'];
  fetchProvidersError: unknown;
  setSelectedSlot: (slot: SlotType | undefined) => void;
  setLocation: ({
    confirmedLocation,
    facility
  }: {
    confirmedLocation?: LocationTypeType;
    facility?: string;
  }) => void;
  bookingInformation: BookingInformation;
  loading: boolean;
};

export const PreferencesContext = createContext<PreferencesContextType | null>(
  null
);

interface ContextProps {
  initialPreferences: GetProvidersInputType;
  skipProviderSelection?: boolean;
  children: React.ReactNode;
}

export const PreferencesProvider: FC<ContextProps> = ({
  children,
  skipProviderSelection,
  initialPreferences
}) => {
  // Filters and preferences for provider selection
  const [filters, setFilters] = useState<FilterType<FilterEnum>[]>(
    preferencesToFiltersArray(initialPreferences)
  );
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);

  const [preferences, setPreferences] =
    useState<GetProvidersInputType>(initialPreferences);

  const [selectedSlot, setSelectedSlot] = useState<SlotType | undefined>(
    undefined
  );

  const [location, setLocation] = useState<
    | {
        confirmedLocation?: LocationTypeType; // The location the patient picked for the slot (TeleHealth or In-Person)
        facility?: string;
      }
    | undefined
  >(undefined);

  const [bookingInformation, setBookingInformation] =
    useState<BookingInformation>({
      providerId: null,
      preferences: initialPreferences
    });

  const {
    provider: { getId: providerId },
    providers: { fetch: fetchProviders, data: providers, loading, error }
  } = useSolApi();

  const updateFilter = (filter: FilterType<FilterEnum>) => {
    const updatedFilters = filters.map((f) => {
      if (f.key === filter.key) {
        return filter;
      }
      return f;
    });
    console.log('update filter', updatedFilters);
    setFilters(updatedFilters);
    const updatedPreferences = updatePreferencesWithFilters(
      initialPreferences,
      updatedFilters
    );
    setPreferences(updatedPreferences);
  };

  const changeActiveFilter = (newFilterKey: FilterKey | null) => {
    if (newFilterKey === null || newFilterKey === activeFilter) {
      setActiveFilter(null);
    } else if (newFilterKey !== null) {
      setActiveFilter(newFilterKey);
    }
  };

  const getActiveFilter = useCallback(() => {
    return filters.find(
      (f) => f.key === activeFilter
    ) as FilterType<FilterEnum>;
  }, [filters, activeFilter]);

  useEffect(() => {
    console.log('preferences updated', preferences);
    if (skipProviderSelection) return;
    fetchProviders(preferences);
  }, [preferences, skipProviderSelection, filters]);

  useEffect(() => {
    setBookingInformation({
      providerId,
      slot: selectedSlot,
      preferences,
      location
    });
  }, [selectedSlot, providerId, preferences, location]);

  const contextValue = {
    preferences,
    filters,
    updateFilter,
    activeFilter,
    setActiveFilter: changeActiveFilter,
    getActiveFilter,
    providers,
    setSelectedSlot,
    setLocation,
    bookingInformation,
    loading,
    fetchProvidersError: error
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};
