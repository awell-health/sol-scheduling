import React, {
  type FC,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  type DeliveryMethodType,
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
  Provider
} from '../atoms/ProviderSelection/types';
import { debounce } from 'lodash-es';
import { useSolApi } from '../SolApiProvider';

type BookingInformation = {
  provider?: Provider;
  slot?: SlotType;
  deliveryMethod?: DeliveryMethodType;
  preferences: GetProvidersInputType;
};

type PreferencesContextType = {
  filters: FilterType<FilterEnum>[];
  setFilters: (filters: FilterType<FilterEnum>[]) => void;
  updateFilter: (filter: FilterType<FilterEnum>) => void;
  activeFilter: keyof GetProvidersInputType | null;
  setActiveFilter: (newFilterKey: keyof GetProvidersInputType | null) => void;
  getActiveFilter: () => FilterType<FilterEnum>;
  providers: GetProvidersResponseType['data'];
  // TODO: Split the upper fields (provider preferences) from the lower fields (booking information)
  selectedProvider: GetProvidersResponseType['data'][number] | undefined;
  setSelectedProviderId: (providerId: string) => void;
  setSelectedSlot: (slot: SlotType | undefined) => void;
  setDeliveryMethod: (method?: DeliveryMethodType) => void;
  bookingInformation: BookingInformation;
  loading: boolean;
};

export const PreferencesContext = createContext<PreferencesContextType | null>(
  null
);

interface ContextProps {
  initialPreferences: GetProvidersInputType;
  children: React.ReactNode;
}

export const PreferencesProvider: FC<ContextProps> = ({
  children,
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

  // Booking information
  const [selectedProvider, setSelectedProvider] = useState<
    GetProvidersResponseType['data'][number] | undefined
  >(undefined);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | undefined>(
    undefined
  );
  const [bookingInformation, setBookingInformation] =
    useState<BookingInformation>({ preferences: initialPreferences });

  const {
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

  const setSelectedProviderId = (providerId: string) => {
    setSelectedProvider(providers.find((p) => p.id === providerId));
  };

  /**
   * Sets the delivery method in the booking information.
   *
   * If no delivery method is provided (i.e., `undefined`), it implies that the user has no preference,
   * which translates to "Both" delivery methods being acceptable.
   * However, `undefined` is still sent to the API in this case to reflect the absence of preference.
   *
   * @param {DeliveryMethodType | undefined} method - The delivery method selected by the user.
   * If `undefined`, it indicates no preference, meaning "Both" methods are acceptable.
   */
  const handleSetDeliveryMethod = (method?: DeliveryMethodType) => {
    setBookingInformation({
      ...bookingInformation,
      deliveryMethod: method
    });
  };

  useEffect(() => {
    fetchProviders(preferences);
  }, [preferences]);

  useEffect(() => {
    setBookingInformation({
      provider: selectedProvider,
      slot: selectedSlot,
      preferences
    });
  }, [selectedSlot, selectedProvider, preferences]);

  const contextValue = {
    filters,
    setFilters: updateFilters,
    updateFilter,
    activeFilter,
    setActiveFilter: changeActiveFilter,
    getActiveFilter,
    providers,
    selectedProvider,
    setSelectedProviderId,
    setSelectedSlot,
    setDeliveryMethod: handleSetDeliveryMethod,
    bookingInformation,
    loading
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};
