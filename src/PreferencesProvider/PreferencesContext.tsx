import React, {
  type FC,
  createContext,
  useCallback,
  useEffect,
  useMemo,
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
import { FilterType, FilterEnum } from '../atoms/ProviderSelection/types';
import { debounce } from 'lodash-es';
import { useSolApi } from '../SolApiProvider';

type BookingInformation = {
  providerId?: string;
  slot?: SlotType;
  deliveryMethod?: DeliveryMethodType;
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
  // TODO: Split the upper fields (provider preferences) from the lower fields (booking information)
  selectedProvider: GetProvidersResponseType['data'][number] | undefined;
  selectedProviderId: string | undefined;
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

  const [selectedProviderId, setSelectedProviderId] = useState<
    string | undefined
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

  const selectedProvider = useMemo(() => {
    /**
     * If a provider ID is passed and the provider selection stage is skipped,
     * this will return undefined since we only have the provider ID without any other details.
     */
    return providers.find((p) => p.id === selectedProviderId);
  }, [providers, selectedProviderId]);

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
    if (skipProviderSelection) return;
    fetchProviders(preferences);
  }, [preferences, skipProviderSelection]);

  useEffect(() => {
    setBookingInformation({
      providerId: selectedProviderId,
      slot: selectedSlot,
      preferences
    });
  }, [selectedSlot, selectedProviderId, preferences]);

  const contextValue = {
    preferences,
    filters,
    setFilters: updateFilters,
    updateFilter,
    activeFilter,
    setActiveFilter: changeActiveFilter,
    getActiveFilter,
    providers,
    selectedProvider,
    selectedProviderId,
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
