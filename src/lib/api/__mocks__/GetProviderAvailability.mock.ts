import { addDays, isSaturday, isSunday } from 'date-fns';
import { GetAvailabilitiesResponseType } from '..';
import { EventDeliveryMethod } from '../schema/atoms/EventDeliveryMethod.schema';

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
        eventId: '<event_id_0>',
        date: getNextWeekday(new Date()),
        providerId: pid,
        slotstart: getNextWeekday(
          addDays(new Date().setUTCHours(16, 0, 0), -1)
        ),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.VirtualOnly
      },
      {
        eventId: '<event_id_1>',
        date: getNextWeekday(new Date()),
        providerId: pid,
        slotstart: getNextWeekday(addDays(new Date().setUTCHours(9, 0, 0), 0)),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: '<event_id_2>',
        date: getNextWeekday(new Date()),
        providerId: pid,
        slotstart: getNextWeekday(addDays(new Date().setUTCHours(10, 0, 0), 1)),
        duration: 45,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: '<event_id_3>',
        date: getNextWeekday(new Date()),
        providerId: pid,
        slotstart: getNextWeekday(addDays(new Date().setUTCHours(16, 0, 0), 1)),
        duration: 45,
        facility: 'NY - Union Square',
        location: EventDeliveryMethod.Both
      },
      {
        eventId: '<event_id_4>',
        date: addDays(getNextWeekday(new Date()), 1),
        providerId: pid,
        slotstart: new Date(
          addDays(getNextWeekday(new Date()), 1).setUTCHours(16, 0, 0)
        ),
        duration: 45,
        facility: 'NY - Union Square',
        location: EventDeliveryMethod.VirtualOnly
      }
    ]
  }
});
