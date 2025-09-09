import { addDays, isSaturday, isSunday, setHours } from 'date-fns';
import { GetAvailabilitiesResponseType } from '..';
import { ProviderEventSchema } from '../schema/molecules/ProviderEvent.schema';

const getNextWeekday = (date: Date): Date => {
  if (isSaturday(date)) {
    return addDays(date, 2); // If Saturday, move to Monday
  }
  if (isSunday(date)) {
    return addDays(date, 1); // If Sunday, move to Monday
  }
  return date; // Otherwise, return the same date
};

export const mockProviderAvailabilityResponse: (
  pid: string
) => GetAvailabilitiesResponseType = (pid) => ({
  data: {
    [pid]: [
      {
        eventId: 't68403en62hji9lad095mv2srk',
        slotstart: setHours(
          addDays(getNextWeekday(new Date()), 0).toISOString(),
          10
        ),
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
        eventType: 'Telehealth',
        facility: 'NY - Brooklyn Heights',
        location: 'Telehealth'
      },
      {
        eventId: 'jnkmeiuv63uimngvjdb6ja5iro',
        slotstart: setHours(
          addDays(getNextWeekday(new Date()), 0).toISOString(),
          11
        ),
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
        eventType: 'Telehealth',
        facility: 'NY - Brooklyn Heights',
        location: 'In-Person'
      },
      {
        eventId: '981t7pvlkc96vjntovihr16h9g',
        slotstart: setHours(
          addDays(getNextWeekday(new Date()), 1).toISOString(),
          15
        ),
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
        eventType: 'Telehealth',
        facility: 'NY - Brooklyn Heights',
        location: 'Telehealth'
      },
      {
        eventId: 'u2dtb7c5vff90jv5s46b3hake0',
        slotstart: setHours(
          addDays(getNextWeekday(new Date()), 2).toISOString(),
          18
        ),
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
        eventType: 'Telehealth',
        facility: 'NY - Brooklyn Heights',
        location: 'In-Person'
      },
      {
        eventId: 'isber21m91efnlqduai88kt1h8',
        slotstart: setHours(
          addDays(getNextWeekday(new Date()), 2).toISOString(),
          16
        ),
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
        eventType: 'Telehealth',
        facility: 'NY - Brooklyn Heights',
        location: 'Telehealth'
      },
      {
        eventId: 't68403en62hji9lad095mv2srk',
        slotstart: setHours(
          addDays(getNextWeekday(new Date()), 2).toISOString(),
          14
        ),
        provider: {
          location: {
            facility: '',
            state: ''
          }
        },
        providerId: '1717',
        date: '2024-10-23',
        duration: 60,
        booked: false,
        eventType: 'Telehealth',
        facility: 'NY - Brooklyn Heights',
        location: 'In-Person'
      },
      {
        eventId: 't68403en62hji9lad095mv2sra',
        slotstart: setHours(
          addDays(getNextWeekday(new Date()), 2).toISOString(),
          15
        ),
        provider: {
          location: {
            facility: '',
            state: ''
          }
        },
        providerId: '1717',
        date: '2024-10-23',
        duration: 60,
        booked: false,
        eventType: 'Telehealth',
        facility: 'NY - Brooklyn Heights',
        location: 'In-Person'
      }
    ].map((e) => ProviderEventSchema.parse(e))
  }
});
