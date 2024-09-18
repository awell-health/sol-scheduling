import React, { type FC, createContext, useEffect, useState } from 'react';
import {
  GetProvidersInputType,
  GetProvidersResponseType,
  SlotType
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
  deliveryMethod?: 'in-person' | 'virtual';
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
  setDeliveryMethod: (method: 'in-person' | 'virtual') => void;
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

  const getActiveFilter = () => {
    return filters.find(
      (f) => f.key === activeFilter
    ) as FilterType<FilterEnum>;
  };

  const setSelectedProviderId = (providerId: string) => {
    setSelectedProvider(providers.find((p) => p.id === providerId));
  };

  const handleSetDeliveryMethod = (method: 'in-person' | 'virtual') => {
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
