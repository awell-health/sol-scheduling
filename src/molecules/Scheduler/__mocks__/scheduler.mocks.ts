import {
  type BookAppointmentResponseType,
  type GetProviderResponseType,
  type SlotWithConfirmedLocation
} from '@/lib/api';
import {
  mockProviderAvailabilityResponse,
  mockProviderResponse
} from '@/lib/api/__mocks__';
import { SalesforcePreferencesType } from '@/lib/utils/preferences';
import { action } from '@storybook/addon-actions';
import { fn } from '@storybook/test';

export const fetchProviderMock = fn(async (pid: string) => {
  // Track the call using Storybook's action
  action('fetchProvider')(pid);

  const data = (await new Promise((resolve) =>
    setTimeout(() => resolve(mockProviderResponse), 1500)
  )) as GetProviderResponseType;

  return data;
});

export const fetchAvailabilityMock = fn(async (pid: string) => {
  // Track the call using Storybook's action
  action('fetchAvailability')(pid);

  return Promise.resolve(mockProviderAvailabilityResponse(pid));
});

export const bookAppointmentMock = fn(
  async (_slot: SlotWithConfirmedLocation) => {
    // Track the call using Storybook's action
    action('bookAppointment')(_slot);

    const data = new Promise((resolve) =>
      setTimeout(() => resolve({ data: [] }), 1500)
    ) as BookAppointmentResponseType;

    return data;
  }
);

export const completeActivityMock = fn(
  async (
    _slot: SlotWithConfirmedLocation,
    _preferences: SalesforcePreferencesType
  ) => {
    // Track the call using Storybook's action
    action('completeActivity')({
      slot: _slot,
      preferences: _preferences
    });
  }
);
