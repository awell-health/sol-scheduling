import {
  preparePreferencesForSalesforce,
  type SalesforcePreferencesType
} from '@/lib/utils/preferences';
import {
  type GetProviderInputType,
  type GetProviderResponseType,
  type BookAppointmentResponseType,
  type GetAvailabilitiesResponseType,
  type GetProvidersInputType,
  type GetProvidersResponseType,
  type SlotWithConfirmedLocation
} from 'lib/api';
import { isEmpty } from 'lodash-es';
import { createContext, FC, useCallback, useState } from 'react';

export interface ProviderApiContextType {
  getId: string | null;
  setId: (id: string | null) => void;
  data?: GetProviderResponseType['data'] | null;
  fetch: (providerId: GetProviderInputType['providerId']) => Promise<void>;
  loading: boolean;
}

export interface ProvidersApiContextType {
  data: GetProvidersResponseType['data'];
  fetch: (prefs: GetProvidersInputType) => Promise<void>;
  loading: boolean;
  error: unknown;
}
export interface AvailabilitiesApiContextType {
  data: GetAvailabilitiesResponseType['data'][string];
  fetch: (providerId: string) => Promise<void>;
  loading: boolean;
}

export type SolApiContextType = {
  provider: ProviderApiContextType;
  providers: ProvidersApiContextType;
  availabilities: AvailabilitiesApiContextType;
  booking: {
    book: (
      slot: SlotWithConfirmedLocation,
      preferences: GetProvidersInputType,
      onError: () => void
    ) => void;
    isBooking: boolean;
  };
};

export const SolApiContext = createContext<SolApiContextType | null>(null);

interface ContextProps {
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  fetchProvider: (
    providerId: GetProviderInputType['providerId']
  ) => Promise<GetProviderResponseType>;
  fetchProviders: (
    prefs: GetProvidersInputType
  ) => Promise<GetProvidersResponseType>;
  bookAppointment: (
    slot: SlotWithConfirmedLocation
  ) => Promise<BookAppointmentResponseType>;
  completeActivity: (
    slot: SlotWithConfirmedLocation,
    preferences: SalesforcePreferencesType
  ) => void;
  children: React.ReactNode;
}

export const SolApiProvider: FC<ContextProps> = ({
  children,
  fetchAvailability,
  fetchProvider,
  fetchProviders,
  bookAppointment,
  completeActivity
}) => {
  const [providerId, setProviderId] = useState<string | null>(null);

  const [isLoadingProviders, setLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState<unknown>(null);
  const [isLoadingProvider, setLoadingProvider] = useState(false);
  const [isLoadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const [provider, setProvider] = useState<
    GetProviderResponseType['data'] | null
  >(null);
  const [providers, setProviders] = useState<GetProvidersResponseType['data']>(
    []
  );
  const [availabilities, setAvailabilities] = useState<
    GetAvailabilitiesResponseType['data'][string]
  >([]);

  const getProvider = useCallback(
    async (providerId: GetProviderInputType['providerId']) => {
      setLoadingProvider(true);

      const res = await fetchProvider(providerId);

      if (!isEmpty(res.data)) {
        setProvider(res.data);
        setProviderId(providerId);
      }
      setLoadingProvider(false);
    },
    [fetchProvider]
  );

  const getProviders = useCallback(
    async (prefs: GetProvidersInputType) => {
      setLoadingProviders(true);
      setProvidersError(null);
      try {
        const res = await fetchProviders(prefs);
        setProviders(res.data);
      } catch (e) {
        setProvidersError(e);
      } finally {
        setLoadingProviders(false);
      }
    },
    [fetchProviders]
  );

  const getAvailabilities = useCallback(
    async (providerId: string) => {
      setLoadingAvailabilities(true);

      const res = await fetchAvailability(providerId);
      setAvailabilities(res.data[providerId]);
      setLoadingAvailabilities(false);
    },
    [fetchAvailability]
  );

  const handleBookAppointment = useCallback(
    (
      slot: SlotWithConfirmedLocation,
      preferences: GetProvidersInputType,
      onError: () => void
    ) => {
      setIsBooking(true);
      bookAppointment(slot)
        .then(() => {
          const parsedPreferencesForSalesforce =
            preparePreferencesForSalesforce(preferences);
          console.log(
            'parsedPreferencesForSalesforce',
            parsedPreferencesForSalesforce
          );
          completeActivity(slot, parsedPreferencesForSalesforce);
        })
        .catch((error) => {
          console.error('Error booking appointment', error);
          onError();
        })
        .finally(() => setIsBooking(false));
    },
    [bookAppointment, completeActivity]
  );

  const contextValue = {
    provider: {
      getId: providerId,
      setId: setProviderId,
      data: provider,
      fetch: getProvider,
      loading: isLoadingProvider
    },
    providers: {
      data: providers,
      fetch: getProviders,
      loading: isLoadingProviders,
      error: providersError
    },
    availabilities: {
      data: availabilities,
      fetch: getAvailabilities,
      loading: isLoadingAvailabilities
    },
    booking: {
      book: handleBookAppointment,
      isBooking
    }
  };

  return (
    <SolApiContext.Provider value={contextValue}>
      {children}
    </SolApiContext.Provider>
  );
};
