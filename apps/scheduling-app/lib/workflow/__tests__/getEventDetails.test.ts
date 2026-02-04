import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server';

// Mock dependencies
vi.mock('lodash', () => ({
  omit: (obj: Record<string, unknown>, keys: string | string[]) => {
    const result = { ...obj };
    if (Array.isArray(keys)) {
      keys.forEach((key) => delete result[key]);
    } else {
      delete result[keys];
    }
    return result;
  }
}));

vi.mock('../../sol-utils', () => ({
  API_METHODS: {
    GET_EVENT: 'GET_EVENT'
  },
  API_ROUTES: {
    GET_EVENT: '/api/event'
  },
  getAccessToken: () => Promise.resolve('mock-access-token'),
  getSolEnvSettings: () => ({
    authUrl: 'https://auth.example.com',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    resource: 'test-resource',
    baseUrl: 'https://api.example.com'
  })
}));

import {
  getEventDetailsStep,
  type GetEventDetailsInput
} from '../steps/getEventDetails';

describe('getEventDetailsStep', () => {
  const defaultInput: GetEventDetailsInput = {
    eventId: 'event-123',
    providerId: 'provider-456',
    timeZone: 'America/Denver'
  };

  const mockApiResponse = {
    data: {
      summary: 'Psychiatric Evaluation',
      slotstart: '2024-06-20T14:00:00.000Z',
      duration: 60,
      booked: false,
      eventType: 'Telehealth',
      facility: 'CO - Cherry Creek',
      location: 'Telehealth',
      provider: {
        name: 'Dr. Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson'
      }
    }
  };

  beforeEach(() => {
    // Set up default success handler
    server.use(
      http.get('https://api.example.com/api/event', () => {
        return HttpResponse.json(mockApiResponse);
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe('successful API call', () => {
    it('returns formatted event details', async () => {
      const result = await getEventDetailsStep(defaultInput);

      expect(result).toMatchObject({
        summary: 'Psychiatric Evaluation',
        slotStartUtc: '2024-06-20T14:00:00.000Z',
        duration: '60',
        booked: false,
        eventType: 'Telehealth',
        eventFacility: 'CO - Cherry Creek',
        userPreferredLocation: 'Telehealth',
        providerName: 'Dr. Sarah Johnson',
        providerFirstName: 'Sarah',
        providerLastName: 'Johnson'
      });
    });

    it('includes localized date and time for Denver timezone', async () => {
      const result = await getEventDetailsStep(defaultInput);

      // 14:00 UTC on June 20 = 8:00 AM MDT (Mountain Daylight Time)
      expect(result.localizedDate).toContain('June');
      expect(result.localizedDate).toContain('20');
      expect(result.localizedDate).toContain('2024');
      expect(result.localizedTime).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });

    it('includes slotStartTime as HH:MM:SS format', async () => {
      const result = await getEventDetailsStep(defaultInput);

      // Should be a time string like "14:00:00"
      expect(result.slotStartTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('localization', () => {
    it('localizes to New York timezone', async () => {
      const nyInput = { ...defaultInput, timeZone: 'America/New_York' };
      const result = await getEventDetailsStep(nyInput);

      // 14:00 UTC = 10:00 AM EDT
      expect(result.localizedTime).toBeDefined();
    });

    it('localizes to Los Angeles timezone', async () => {
      const laInput = { ...defaultInput, timeZone: 'America/Los_Angeles' };
      const result = await getEventDetailsStep(laInput);

      // 14:00 UTC = 7:00 AM PDT
      expect(result.localizedTime).toBeDefined();
    });
  });

  describe('fallback handling', () => {
    it('handles missing provider data', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockApiResponse.data,
              provider: null
            }
          });
        })
      );

      const result = await getEventDetailsStep(defaultInput);

      expect(result.providerName).toBe('');
      expect(result.providerFirstName).toBe('');
      expect(result.providerLastName).toBe('');
    });

    it('handles missing facility', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockApiResponse.data,
              facility: null
            }
          });
        })
      );

      const result = await getEventDetailsStep(defaultInput);

      expect(result.eventFacility).toBe('');
    });

    it('handles missing location', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockApiResponse.data,
              location: null
            }
          });
        })
      );

      const result = await getEventDetailsStep(defaultInput);

      expect(result.userPreferredLocation).toBe('');
    });
  });

  describe('API errors', () => {
    it('throws on non-OK response', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return new HttpResponse('Event not found', {
            status: 404,
            statusText: 'Not Found'
          });
        })
      );

      await expect(getEventDetailsStep(defaultInput)).rejects.toThrow(
        'Failed to get event details: 404 Not Found'
      );
    });

    it('throws on 500 error', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return new HttpResponse('Server error', {
            status: 500,
            statusText: 'Internal Server Error'
          });
        })
      );

      await expect(getEventDetailsStep(defaultInput)).rejects.toThrow(
        'Failed to get event details: 500 Internal Server Error'
      );
    });
  });
});

/**
 * Test the date/time localization utility extracted from the step.
 * This tests the pure function logic without API dependencies.
 */
describe('getLocalDateTimeString (logic)', () => {
  // Testing the localization logic that would be in the extracted function
  function getLocalDateTimeString(
    isoDate: string,
    timeZone: string,
    locale: string
  ): { date: string; time: string } {
    const dateObj = new Date(isoDate);

    const date = dateObj.toLocaleDateString(locale, {
      timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const time = dateObj.toLocaleTimeString(locale, {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return { date, time };
  }

  it('formats date with weekday, month, day, year', () => {
    const { date } = getLocalDateTimeString(
      '2024-06-20T14:00:00.000Z',
      'America/Denver',
      'en-US'
    );

    expect(date).toContain('Thursday');
    expect(date).toContain('June');
    expect(date).toContain('20');
    expect(date).toContain('2024');
  });

  it('formats time in 12-hour format', () => {
    const { time } = getLocalDateTimeString(
      '2024-06-20T14:00:00.000Z',
      'America/Denver',
      'en-US'
    );

    // 14:00 UTC = 8:00 AM MDT
    expect(time).toMatch(/8:00\s?AM/i);
  });

  it('handles timezone conversions correctly', () => {
    const utcDate = '2024-06-20T18:00:00.000Z';

    const denver = getLocalDateTimeString(utcDate, 'America/Denver', 'en-US');
    const newYork = getLocalDateTimeString(
      utcDate,
      'America/New_York',
      'en-US'
    );
    const losAngeles = getLocalDateTimeString(
      utcDate,
      'America/Los_Angeles',
      'en-US'
    );

    // 18:00 UTC = 12:00 PM MDT, 2:00 PM EDT, 11:00 AM PDT
    expect(denver.time).toMatch(/12:00\s?PM/i);
    expect(newYork.time).toMatch(/2:00\s?PM/i);
    expect(losAngeles.time).toMatch(/11:00\s?AM/i);
  });

  it('handles midnight correctly', () => {
    const { time } = getLocalDateTimeString(
      '2024-06-20T06:00:00.000Z', // Midnight MDT
      'America/Denver',
      'en-US'
    );

    expect(time).toMatch(/12:00\s?AM/i);
  });

  it('handles noon correctly', () => {
    const { time } = getLocalDateTimeString(
      '2024-06-20T18:00:00.000Z', // Noon MDT
      'America/Denver',
      'en-US'
    );

    expect(time).toMatch(/12:00\s?PM/i);
  });
});
