import { SelectedSlot } from '@/lib/api/schema/shared.schema';
import {
  preparePreferencesForSalesforce,
  type SalesforcePreferencesType
} from '@/lib/utils/preferences';
import {
  type BookAppointmentResponseType,
  type GetAvailabilitiesResponseType,
  type GetProvidersInputType,
  type GetProvidersResponseType
} from 'lib/api';
import { createContext, FC, useState } from 'react';

export interface ProvidersApiContextType {
  data: GetProvidersResponseType['data'];
  fetch: (prefs: GetProvidersInputType) => void;
  loading: boolean;
}
export interface AvailabilitiesApiContextType {
  data: GetAvailabilitiesResponseType['data'][string];
  fetch: (providerId: string) => void;
  loading: boolean;
}

export type SolApiContextType = {
  providers: ProvidersApiContextType;
  availabilities: AvailabilitiesApiContextType;
  bookAppointment: (
    slot: SelectedSlot,
    preferences: GetProvidersInputType,
    onError: () => void
  ) => void;
  isBooking: boolean;
};

export const SolApiContext = createContext<SolApiContextType | null>(null);

interface ContextProps {
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  fetchProviders: (
    prefs: GetProvidersInputType
  ) => Promise<GetProvidersResponseType>;
  bookAppointment: (slot: SelectedSlot) => Promise<BookAppointmentResponseType>;
  completeActivity: (
    slot: SelectedSlot,
    preferences: SalesforcePreferencesType
  ) => void;
  children: React.ReactNode;
}

export const SolApiProvider: FC<ContextProps> = ({
  children,
  fetchAvailability,
  fetchProviders,
  bookAppointment,
  completeActivity
}) => {
  // Providers
  const [providers, setProviders] = useState<GetProvidersResponseType['data']>(
    []
  );
  const getProviders = (prefs: GetProvidersInputType) => {
    setLoadingProviders(true);
    fetchProviders(prefs)
      .then((resp) => {
        setProviders(resp.data);
      })
      .finally(() => setLoadingProviders(false));
  };
  const [isLoadingProviders, setLoadingProviders] = useState(false);
  // Availabilities
  const [availabilities, setAvailabilities] = useState<
    GetAvailabilitiesResponseType['data'][string]
  >([]);
  const getAvailabilities = (providerId: string) => {
    setLoadingAvailabilities(true);
    fetchAvailability(providerId)
      .then((resp) => {
        setAvailabilities(resp.data[providerId]);
      })
      .finally(() => setLoadingAvailabilities(false));
  };
  const [isLoadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookAppointment = (
    slot: SelectedSlot,
    preferences: GetProvidersInputType,
    onError: () => void
  ) => {
    setIsBooking(true);
    bookAppointment(slot)
      .then(() => {
        const parsedPreferencesForSalesforce =
          preparePreferencesForSalesforce(preferences);
        completeActivity(slot, parsedPreferencesForSalesforce);
      })
      .catch(() => {
        console.error('Error booking appointment');
        onError();
      })
      .finally(() => setIsBooking(false));
  };

  const contextValue = {
    providers: {
      data: providers,
      fetch: getProviders,
      loading: isLoadingProviders
    },
    availabilities: {
      data: availabilities,
      fetch: getAvailabilities,
      loading: isLoadingAvailabilities
    },
    bookAppointment: handleBookAppointment,
    isBooking: isBooking
  };
  return (
    <SolApiContext.Provider value={contextValue}>
      {children}
    </SolApiContext.Provider>
  );
};
