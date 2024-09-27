import { SelectedSlot } from '@/lib/api/schema/shared.schema';
import {
  type GetProvidersInputType,
  type BookAppointmentResponseType,
  type GetAvailabilitiesResponseType,
  type GetProvidersResponseType,
  type GetProviderInputType,
  type GetProviderResponseType
} from '../lib/api';
import { type SalesforcePreferencesType } from '@/lib/utils/preferences';

export interface SchedulingActivityProps {
  providerId?: string;
  onBooking: (slot: SelectedSlot) => Promise<BookAppointmentResponseType>;
  fetchProvider: (
    input: GetProviderInputType
  ) => Promise<GetProviderResponseType>;
  fetchProviders: (
    prefs: GetProvidersInputType
  ) => Promise<GetProvidersResponseType>;
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  onCompleteActivity: (
    slot: SelectedSlot,
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
