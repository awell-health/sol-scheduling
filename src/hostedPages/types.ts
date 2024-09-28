import {
  type GetProvidersInputType,
  type BookAppointmentResponseType,
  type GetAvailabilitiesResponseType,
  type GetProvidersResponseType,
  type GetProviderInputType,
  type GetProviderResponseType,
  type SlotWithConfirmedLocation
} from '../lib/api';
import { type SalesforcePreferencesType } from '@/lib/utils/preferences';

export interface SchedulingActivityProps {
  providerId?: string;
  onBooking: (
    slot: SlotWithConfirmedLocation
  ) => Promise<BookAppointmentResponseType>;
  fetchProvider: (
    providerId: GetProviderInputType['providerId']
  ) => Promise<GetProviderResponseType>;
  fetchProviders: (
    prefs: GetProvidersInputType
  ) => Promise<GetProvidersResponseType>;
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  onCompleteActivity: (
    slot: SlotWithConfirmedLocation,
    preferences: SalesforcePreferencesType
  ) => void;
  providerPreferences: GetProvidersInputType;
  text?: {
    selectProvider?: {
      button?: string;
    };
    selectSlot?: {
      backToProviders?: string;
      title?: string;
      selectSlot?: string;
      button?: string;
    };
    bookingConfirmation?: {
      bookingConfirmed?: string;
    };
    completeActivity?: {
      nextButton?: string;
    };
  };
  opts?: {
    allowSchedulingInThePast?: boolean;
  };
}
