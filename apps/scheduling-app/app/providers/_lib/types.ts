import { z } from 'zod';
import {
  BookAppointmentInputSchema,
  BookAppointmentResponseSchema,
  ClinicalFocus,
  DeliveryMethod,
  Gender,
  GetAvailabilitiesResponseSchema,
  GetProviderResponseSchema,
  GetProvidersInputSchema,
  GetProvidersResponseSchema,
  Language,
  LocationFacility,
  LocationState,
  LocationStateToNameMapping,
  Modality,
  SlotWithConfirmedLocation as SlotWithConfirmedLocationSchemaType,
  TherapeuticModalitySchema,
  TimeOfTheDay
} from './schemas';

export {
  BookAppointmentInputSchema,
  BookAppointmentResponseSchema,
  ClinicalFocus,
  DeliveryMethod,
  Gender,
  GetAvailabilitiesResponseSchema,
  GetProviderResponseSchema,
  GetProvidersInputSchema,
  GetProvidersResponseSchema,
  Language,
  LocationFacility,
  LocationState,
  LocationStateToNameMapping,
  Modality,
  TherapeuticModalitySchema,
  TimeOfTheDay
};

export type ProviderSearchFilters = z.infer<typeof GetProvidersInputSchema>;
export type ProvidersResponse = z.infer<typeof GetProvidersResponseSchema>;
export type ProviderResponse = z.infer<typeof GetProviderResponseSchema>;
export type AvailabilityResponse = z.infer<
  typeof GetAvailabilitiesResponseSchema
>;
export type BookAppointmentResponse = z.infer<
  typeof BookAppointmentResponseSchema
>;
export type ProviderSummary = ProvidersResponse['data'][number];
export type AvailabilitySlot = AvailabilityResponse['data'][string][number];
export type SlotWithConfirmedLocation = SlotWithConfirmedLocationSchemaType;
