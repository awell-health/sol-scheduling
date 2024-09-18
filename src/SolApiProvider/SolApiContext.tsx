import { SelectedSlot } from '@/lib/api/schema/shared.schema';
import {
  BookAppointmentResponseType,
  GetAvailabilitiesResponseType,
  GetProvidersInputType,
  GetProvidersResponseType
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
    preferences: GetProvidersInputType
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
        console.log(
          `set availabilities for provider id ${providerId}`,
          resp.data[providerId]
        );
      })
      .finally(() => setLoadingAvailabilities(false));
  };
  const [isLoadingAvailabilities, setLoadingAvailabilities] = useState(false);

  const handleBookAppointment = (
    slot: SelectedSlot,
    preferences: GetProvidersInputType,
    onError: () => void
  ) => {
    bookAppointment(slot)
      .then((resp) => {
        console.log('Booked appointment', resp);
        completeActivity(slot, preferences);
      })
      .catch(() => {
        console.error('Error booking appointment');
        onError();
      });
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
    bookAppointment: handleBookAppointment
  };
  return (
    <SolApiContext.Provider value={contextValue}>
      {children}
    </SolApiContext.Provider>
  );
};
