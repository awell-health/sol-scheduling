import {
  GetProvidersInputType,
  type BookAppointmentResponseType,
  type GetAvailabilitiesResponseType,
  type GetProvidersResponseType,
  type SlotType
} from '../lib/api';

export interface SchedulingActivityProps {
  // timeZone: string;
  providerId?: string;
  // onProviderSelect: (id: string) => void;
  // onDateSelect: (date: Date) => void;
  // onSlotSelect: (slot: SlotType) => void;
  onBooking: (slot: SlotType) => Promise<BookAppointmentResponseType>;
  fetchProviders: (
    prefs: GetProvidersInputType
  ) => Promise<GetProvidersResponseType>;
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  onCompleteActivity: (
    slot: SlotType,
    preferences: GetProvidersInputType
  ) => void;
  providerPreferences: GetProvidersInputType;
  // onProviderPreferencesChange: (preferences: GetProvidersInputType) => void;
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
