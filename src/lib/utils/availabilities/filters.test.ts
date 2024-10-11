import { expect, describe, it } from '@jest/globals';

import { filterByLocation, filterByDate } from './';
import { LocationType, SlotType, EventDeliveryMethod } from '../../api';

const mockData = [
  {
    eventId: '<event_id_0>',
    providerId: '123',
    slotstart: new Date(new Date('2024-01-01').setUTCHours(16, 0, 0)),
    duration: 60,
    facility: 'CO - Cherry Creek',
    location: EventDeliveryMethod.Telehealth
  },
  {
    eventId: '<event_id_1>',
    providerId: '123',
    slotstart: new Date(new Date('2024-01-01').setUTCHours(9, 0, 0)),
    duration: 60,
    facility: 'CO - Cherry Creek',
    location: EventDeliveryMethod.InPerson
  },
  {
    eventId: '<event_id_2>',
    providerId: '123',
    slotstart: new Date(new Date('2024-02-01').setUTCHours(10, 0, 0)),
    duration: 45,
    facility: 'NY - Union Square',
    location: EventDeliveryMethod.InPerson
  },
  {
    eventId: '<event_id_3>',
    providerId: '123',
    slotstart: new Date(new Date('2024-02-01').setUTCHours(16, 0, 0)),
    duration: 45,
    facility: 'NY - Union Square',
    location: EventDeliveryMethod.Telehealth
  }
] satisfies SlotType[];

describe('filterByLocation', () => {
  it('should return all availabilities if no location type is provided', () => {
    const result = filterByLocation({ availabilities: mockData });
    expect(result).toEqual(mockData);
  });

  it('should return availabilities for a specific facility and Both location type', () => {
    const result = filterByLocation({
      availabilities: mockData,
      location: {
        facility: 'CO - Cherry Creek',
        confirmedLocation: LocationType.InPerson
      }
    });

    expect(result).toEqual([
      {
        eventId: '<event_id_1>',
        providerId: '123',
        slotstart: new Date(new Date('2024-01-01').setUTCHours(9, 0, 0)),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.InPerson
      }
    ]);
  });

  it('should return all "In-Person" availabilities if location type is "In-Person" and facility is unknown', () => {
    const result = filterByLocation({
      availabilities: mockData,
      location: {
        facility: undefined,
        confirmedLocation: LocationType.InPerson
      }
    });

    expect(result).toEqual([
      {
        eventId: '<event_id_1>',
        providerId: '123',
        slotstart: new Date(new Date('2024-01-01').setUTCHours(9, 0, 0)),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.InPerson
      },
      {
        eventId: '<event_id_2>',
        providerId: '123',
        slotstart: new Date(new Date('2024-02-01').setUTCHours(10, 0, 0)),
        duration: 45,
        facility: 'NY - Union Square',
        location: EventDeliveryMethod.InPerson
      }
    ]);
  });

  it('should return all availabilities if locationType is Telehealth', () => {
    const result = filterByLocation({
      availabilities: mockData,
      location: {
        confirmedLocation: LocationType.Telehealth
      }
    });
    expect(result).toEqual(mockData);
  });

  it('should return no availabilities if facility is provided but no matching slots exist', () => {
    const result = filterByLocation({
      availabilities: mockData,
      location: {
        facility: 'Non-existent Facility',
        confirmedLocation: LocationType.InPerson
      }
    });
    expect(result).toEqual([]);
  });
});

describe('filterByDate', () => {
  it('should return all availabilities if no date is provided', () => {
    const result = filterByDate({ availabilities: mockData, date: null });
    expect(result).toEqual(mockData);
  });

  it('should return availabilities for the same day as the provided date', () => {
    const targetDate = new Date('2024-01-01');
    const result = filterByDate({ availabilities: mockData, date: targetDate });

    expect(result).toEqual([
      {
        eventId: '<event_id_0>',
        providerId: '123',
        slotstart: new Date(new Date('2024-01-01').setUTCHours(16, 0, 0)),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.Telehealth
      },
      {
        eventId: '<event_id_1>',
        providerId: '123',
        slotstart: new Date(new Date('2024-01-01').setUTCHours(9, 0, 0)),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: EventDeliveryMethod.InPerson
      }
    ]);
  });

  it('should return no availabilities if no slots match the provided date', () => {
    const date = new Date('1997-02-01');
    const result = filterByDate({
      availabilities: mockData,
      date
    });

    expect(result).toEqual([]);
  });
});
