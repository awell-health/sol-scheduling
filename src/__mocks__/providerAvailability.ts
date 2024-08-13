import { addDays } from 'date-fns';

export const mockProviderAvailabilityResponse = {
  '<provider_id1>': [
    {
      eventId: '<event_id>',
      date: new Date(),
      providerId: '<provider_id>',
      startDate: new Date().setUTCHours(9, 0, 0),
      duration: 60
    },
    {
      eventId: '<event_id>',
      date: new Date(),
      providerId: '<provider_id>',
      startDate: addDays(new Date().setUTCHours(10, 0, 0), 1),
      duration: 45
    },
    {
      eventId: '<event_id>',
      date: new Date(),
      providerId: '<provider_id>',
      startDate: addDays(new Date().setUTCHours(16, 0, 0), 1),
      duration: 45
    }
  ]
};
