import { addDays } from 'date-fns';
import { GetAvailabilitiesResponseType } from 'lib/api/availabilities.schema';

export const mockProviderAvailabilityResponse: GetAvailabilitiesResponseType = {
  data: [
    {
      eventId: '<event_id_1>',
      date: new Date(),
      providerId: '<provider_id_1>',
      startDate: addDays(new Date().setUTCHours(9, 0, 0), 0),
      duration: 60,
      Booked: 0
    },
    {
      eventId: '<event_id_2>',
      date: new Date(),
      providerId: '<provider_id_1>',
      startDate: addDays(new Date().setUTCHours(10, 0, 0), 1),
      duration: 45,
      Booked: 0
    },
    {
      eventId: '<event_id_3>',
      date: new Date(),
      providerId: '<provider_id_1>',
      startDate: addDays(new Date().setUTCHours(16, 0, 0), 1),
      duration: 45,
      Booked: 0
    }
  ]
};
