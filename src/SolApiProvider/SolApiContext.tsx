import {
  BookAppointmentResponseType,
  GetAvailabilitiesResponseType,
  GetProvidersInputType,
  GetProvidersResponseType,
  SlotType
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
  bookAppointment: (slot: SlotType) => Promise<BookAppointmentResponseType>;
};

export const SolApiContext = createContext<SolApiContextType | null>(null);

interface ContextProps {
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  fetchProviders: (
    prefs: GetProvidersInputType
  ) => Promise<GetProvidersResponseType>;
  bookAppointment: (slot: SlotType) => Promise<BookAppointmentResponseType>;
  children: React.ReactNode;
}

export const SolApiProvider: FC<ContextProps> = ({
  children,
  fetchAvailability,
  fetchProviders,
  bookAppointment
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
    bookAppointment
  };
  return (
    <SolApiContext.Provider value={contextValue}>
      {children}
    </SolApiContext.Provider>
  );
};