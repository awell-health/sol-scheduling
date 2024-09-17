import React, { type FC, createContext, useContext, useState } from 'react';
import { GetProvidersInputType } from '../../lib/api';
import {
  preferencesToFiltersArray,
  updatePreferencesWithFilters
} from './utils';
import { FilterType, FilterEnum } from './types';
import { debounce } from 'lodash-es';

type ProviderFilterContextType = {
  filters: FilterType<FilterEnum>[];
  setFilters: (filters: FilterType<FilterEnum>[]) => void;
  updateFilter: (filter: FilterType<FilterEnum>) => void;
  activeFilter: keyof GetProvidersInputType | null;
  setActiveFilter: (newFilterKey: keyof GetProvidersInputType | null) => void;
  getActiveFilter: () => FilterType<FilterEnum>;
};

const ProviderFilterContext = createContext<ProviderFilterContextType | null>(
  null
);

interface ContextProps {
  initialPreferences: GetProvidersInputType;
  onProviderPreferencesChange: (prefs: GetProvidersInputType) => void;
  children: React.ReactNode;
}

export const ProviderFilterProvider: FC<ContextProps> = ({
  children,
  initialPreferences,
  onProviderPreferencesChange
}) => {
  console.log('rendered provider state');
  const [filters, setFilters] = useState<FilterType<FilterEnum>[]>(
    preferencesToFiltersArray(initialPreferences)
  );
  const [activeFilter, setActiveFilter] = useState<
    keyof GetProvidersInputType | null
  >(null);

  const updateFilters = debounce((newFilters: FilterType<FilterEnum>[]) => {
    const updatedPreferences = updatePreferencesWithFilters(
      initialPreferences,
      newFilters
    );
    onProviderPreferencesChange(updatedPreferences);
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

  const contextValue = {
    filters,
    setFilters: updateFilters,
    updateFilter,
    activeFilter,
    setActiveFilter: changeActiveFilter,
    getActiveFilter
  };

  return (
    <ProviderFilterContext.Provider value={contextValue}>
      {children}
    </ProviderFilterContext.Provider>
  );
};

export const useProviderFilter = () => {
  const context = useContext(ProviderFilterContext);
  if (!context) {
    throw new Error(
      'useProviderFilter must be used within a ProviderFilterProvider'
    );
  }
  return context;
};
