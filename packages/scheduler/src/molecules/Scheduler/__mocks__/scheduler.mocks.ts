import {
  GetAvailabilitiesResponseType,
  type BookAppointmentResponseType,
  type GetProviderResponseType,
  type SlotWithConfirmedLocation
} from '@/lib/api';
import { mockProviderResponse } from '@/lib/api/__mocks__';
import { SalesforcePreferencesType } from '@/lib/utils/preferences';
import { action } from '@storybook/addon-actions';
import { fn } from '@storybook/test';
import { ProviderEventSchema } from '../../../lib/api/schema/molecules/ProviderEvent.schema';

export const fetchProviderMock: (
  pid: string
) => Promise<GetProviderResponseType> = fn(async (pid: string) => {
  // Track the call using Storybook's action
  action('fetchProvider')(pid);

  const data = (await new Promise((resolve) =>
    setTimeout(() => resolve(mockProviderResponse), 1500)
  )) as GetProviderResponseType;

  return data;
});

export const fetchAvailabilityMock: (
  pid: string
) => Promise<GetAvailabilitiesResponseType> = fn(async (pid: string) => {
  // Track the call using Storybook's action
  action('fetchAvailability')(pid);

  /**
   * Returning hardcoded data for the sake of the storybook and to avoid flaky tests.
   * The current date is mocked to be 2024-10-14
   */
  return Promise.resolve({
    data: {
      [pid]: [
        {
          eventId: '1D50DD19-E17B-4744-82A8-20436F8B5B27',
          slotstart: '2025-10-09T12:00:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '2081',
          date: '2025-10-09',
          duration: 60,
          booked: false,
          eventType: 'Telehealth',
          facility: 'NY - Massapequa',
          location: 'Telehealth'
        },
        {
          eventId: 'C636D781-0E68-4EF4-A535-7467919EF7FF',
          slotstart: '2025-11-04T18:00:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '2081',
          date: '2025-11-04',
          duration: 60,
          booked: false,
          eventType: 'In-Person',
          facility: 'NY - Massapequa',
          location: 'In-Person'
        },
        {
          eventId: 'AC7A9E24-A843-485A-99AF-C39FE7698B55',
          slotstart: '2025-11-05T17:30:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '2081',
          date: '2025-11-05',
          duration: 60,
          booked: false,
          eventType: 'In-Person',
          facility: 'NY - Melville',
          location: 'In-Person'
        },
        {
          eventId: '268FF98A-BE5A-482E-B3AC-39048AB7F135',
          slotstart: '2025-11-05T19:30:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '2081',
          date: '2025-11-05',
          duration: 60,
          booked: false,
          eventType: 'In-Person',
          facility: 'NY - Melville',
          location: 'In-Person'
        },
        {
          eventId: 'B6B02E8C-0892-4759-BBA9-D376530A40EB',
          slotstart: '2025-11-05T21:30:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '2081',
          date: '2025-11-05',
          duration: 60,
          booked: false,
          eventType: 'In-Person',
          facility: 'NY - Melville',
          location: 'In-Person'
        }
      ].map((e) => ProviderEventSchema.parse(e))
    }
  });
});

export const bookAppointmentMock: (
  slot: SlotWithConfirmedLocation
) => Promise<BookAppointmentResponseType> = fn(
  async (_slot: SlotWithConfirmedLocation) => {
    // Track the call using Storybook's action
    action('bookAppointment')(_slot);

    const data = new Promise((resolve) =>
      setTimeout(() => resolve({ data: [] }), 1500)
    ) as BookAppointmentResponseType;

    return data;
  }
);

export const completeActivityMock: (
  slot: SlotWithConfirmedLocation,
  preferences: SalesforcePreferencesType
) => void = fn(
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
