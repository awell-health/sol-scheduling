import { SelectedSlot } from '@/lib/api/schema/shared.schema';
import {
  GetProvidersInputType,
  type BookAppointmentResponseType,
  type GetAvailabilitiesResponseType,
  type GetProvidersResponseType
} from '../lib/api';

export interface SchedulingActivityProps {
  providerId?: string;
  onBooking: (slot: SelectedSlot) => Promise<BookAppointmentResponseType>;
  fetchProviders: (
    prefs: GetProvidersInputType
  ) => Promise<GetProvidersResponseType>;
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  onCompleteActivity: (
    slot: SelectedSlot,
    preferences: GetProvidersInputType
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
