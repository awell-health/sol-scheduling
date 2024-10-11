// import { addDays, isSaturday, isSunday } from 'date-fns';
import { GetAvailabilitiesResponseType } from '..';
import * as schema from '../schema/GetProviderAvailability.schema';

// const getNextWeekday = (date: Date): Date => {
//   if (isSaturday(date)) {
//     return addDays(date, 2); // If Saturday, move to Monday
//   }
//   if (isSunday(date)) {
//     return addDays(date, 1); // If Sunday, move to Monday
//   }
//   return date; // Otherwise, return the same date
// };

export const mockProviderAvailabilityResponse: (
  pid: string
) => GetAvailabilitiesResponseType = (pid) => ({
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
        location: 'both'
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
        location: 'both'
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
