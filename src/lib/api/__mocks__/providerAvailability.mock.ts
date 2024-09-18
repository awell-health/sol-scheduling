import { addDays } from 'date-fns';
import { GetAvailabilitiesResponseType } from '..';
import { EventDeliveryMethod } from '../schema/atoms/eventDeliveryMethod.schema';

export const mockProviderAvailabilityResponse: (
  pid: string
) => GetAvailabilitiesResponseType = (pid) => ({
  data: {
    [pid]: [
      {
        eventId: '<event_id_0>',
        date: new Date(),
        providerId: pid,
        slotstart: addDays(new Date().setUTCHours(16, 0, 0), -1),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.VirtualOnly
      },
      {
        eventId: '<event_id_1>',
        date: new Date(),
        providerId: pid,
        slotstart: addDays(new Date().setUTCHours(9, 0, 0), 0),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: '<event_id_2>',
        date: new Date(),
        providerId: pid,
        slotstart: addDays(new Date().setUTCHours(10, 0, 0), 1),
        duration: 45,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: '<event_id_3>',
        date: new Date(),
        providerId: pid,
        slotstart: addDays(new Date().setUTCHours(16, 0, 0), 1),
        duration: 45,
        facility: 'NY - Union Square',
        location: EventDeliveryMethod.Both
      }
    ]
  }
});
