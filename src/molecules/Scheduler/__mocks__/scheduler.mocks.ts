import {
  type BookAppointmentResponseType,
  type GetProviderResponseType,
  type SlotWithConfirmedLocation
} from '@/lib/api';
import { mockProviderResponse } from '@/lib/api/__mocks__';
import { SalesforcePreferencesType } from '@/lib/utils/preferences';
import { action } from '@storybook/addon-actions';
import { fn } from '@storybook/test';
import * as schema from '../../../lib/api/schema';

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

  /**
   * Returning hardcoded data for the sake of the storybook and to avoid flaky tests.
   * The current date is mocked to be 2024-10-14
   */
  return Promise.resolve({
    data: {
      [pid]: [
        {
          eventId: 't68403en62hji9lad095mv2srk',
          slotstart: '2024-10-17T21:00:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '1717',
          date: '2024-10-17',
          duration: 60,
          booked: false,
          facility: 'NY - Brooklyn Heights',
          location: 'Telehealth'
        },
        {
          eventId: 'jnkmeiuv63uimngvjdb6ja5iro',
          slotstart: '2024-10-18T14:00:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '1717',
          date: '2024-10-18',
          duration: 60,
          booked: false,
          facility: 'NY - Brooklyn Heights',
          location: 'In-Person'
        },
        {
          eventId: '981t7pvlkc96vjntovihr16h9g',
          slotstart: '2024-10-21T18:00:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '1717',
          date: '2024-10-21',
          duration: 60,
          booked: false,
          facility: 'NY - Brooklyn Heights',
          location: 'Telehealth'
        },
        {
          eventId: 'u2dtb7c5vff90jv5s46b3hake0',
          slotstart: '2024-10-21T19:00:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '1717',
          date: '2024-10-21',
          duration: 60,
          booked: false,
          facility: 'NY - Brooklyn Heights',
          location: 'In-Person'
        },
        {
          eventId: 'isber21m91efnlqduai88kt1h8',
          slotstart: '2024-10-22T15:00:00Z',
          provider: {
            location: {
              facility: '',
              state: ''
            }
          },
          providerId: '1717',
          date: '2024-10-22',
          duration: 60,
          booked: false,
          facility: 'NY - Brooklyn Heights',
          location: 'Telehealth'
        }
      ].map((e) => schema.Event.parse(e))
    }
  });
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
