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
import { FilterType, FilterEnum } from '../atoms/ProviderSelection/types';
import { debounce } from 'lodash-es';
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
  setFilters: (filters: FilterType<FilterEnum>[]) => void;
  updateFilter: (filter: FilterType<FilterEnum>) => void;
  activeFilter: keyof GetProvidersInputType | null;
  setActiveFilter: (newFilterKey: keyof GetProvidersInputType | null) => void;
  getActiveFilter: () => FilterType<FilterEnum>;
  providers: GetProvidersResponseType['data'];
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
  const [activeFilter, setActiveFilter] = useState<
    keyof GetProvidersInputType | null
  >(null);

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
    providers: { fetch: fetchProviders, data: providers, loading: loading }
  } = useSolApi();

  const updateFilters = debounce((newFilters: FilterType<FilterEnum>[]) => {
    const updatedPreferences = updatePreferencesWithFilters(
      initialPreferences,
      newFilters
    );
    setPreferences(updatedPreferences);
  }, 500);

  const updateFilter = (filter: FilterType<FilterEnum>) => {
    const updatedFilters = filters.map((f) => {
      if (f.key === filter.key) {
        return filter;
      }
      return f;
    });
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
  };

  const changeActiveFilter = (
    newFilterKey: keyof GetProvidersInputType | null
  ) => {
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
    if (skipProviderSelection) return;
    fetchProviders(preferences);
  }, [preferences, skipProviderSelection]);

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
    setFilters: updateFilters,
    updateFilter,
    activeFilter,
    setActiveFilter: changeActiveFilter,
    getActiveFilter,
    providers,
    setSelectedSlot,
    setLocation,
    bookingInformation,
    loading
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};
