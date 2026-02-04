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
    BOOK_EVENT: 'BOOK_EVENT'
  },
  API_ROUTES: {
    BOOK_EVENT: '/api/event/book'
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
  bookAppointmentStep,
  type BookAppointmentStepInput
} from '../steps/bookAppointment';

describe('bookAppointmentStep', () => {
  const defaultInput: BookAppointmentStepInput = {
    eventId: 'event-123',
    providerId: 'provider-456',
    userName: 'John Doe',
    salesforceLeadId: 'lead-789',
    locationType: 'Telehealth'
  };

  const mockSuccessResponse = {
    data: {
      success: true,
      eventId: 'event-123',
      confirmationNumber: 'CONF-12345'
    }
  };

  beforeEach(() => {
    // Reset environment variable
    delete process.env.MOCK_BOOKING_RESPONSE;

    // Set up default success handler
    server.use(
      http.post('https://api.example.com/api/event/book', () => {
        return HttpResponse.json(mockSuccessResponse);
      })
    );
  });

  afterEach(() => {
    delete process.env.MOCK_BOOKING_RESPONSE;
    server.resetHandlers();
  });

  describe('mock mode (MOCK_BOOKING_RESPONSE=true)', () => {
    beforeEach(() => {
      process.env.MOCK_BOOKING_RESPONSE = 'true';
    });

    it('returns mocked success response without calling API', async () => {
      const result = await bookAppointmentStep(defaultInput);

      expect(result).toEqual({
        success: true,
        eventId: 'event-123',
        data: { mocked: true, eventId: 'event-123' }
      });
    });

    it('uses the provided eventId in mock response', async () => {
      const result = await bookAppointmentStep({
        ...defaultInput,
        eventId: 'different-event-id'
      });

      expect(result.eventId).toBe('different-event-id');
      expect(result.data).toEqual({
        mocked: true,
        eventId: 'different-event-id'
      });
    });
  });

  describe('real API call', () => {
    it('returns success response with eventId and data', async () => {
      const result = await bookAppointmentStep(defaultInput);

      expect(result).toEqual({
        success: true,
        eventId: 'event-123',
        data: mockSuccessResponse.data
      });
    });

    it('handles response without nested data property', async () => {
      const flatResponse = {
        success: true,
        eventId: 'event-123',
        confirmationNumber: 'CONF-12345'
      };

      server.use(
        http.post('https://api.example.com/api/event/book', () => {
          return HttpResponse.json(flatResponse);
        })
      );

      const result = await bookAppointmentStep(defaultInput);

      expect(result.data).toEqual(flatResponse);
    });
  });

  describe('API errors', () => {
    it('throws on non-OK response', async () => {
      server.use(
        http.post('https://api.example.com/api/event/book', () => {
          return new HttpResponse('Invalid event ID', {
            status: 400,
            statusText: 'Bad Request'
          });
        })
      );

      await expect(bookAppointmentStep(defaultInput)).rejects.toThrow(
        'Failed to book appointment: 400 Bad Request'
      );
    });

    it('throws on 409 conflict (slot already booked)', async () => {
      server.use(
        http.post('https://api.example.com/api/event/book', () => {
          return new HttpResponse('Time slot already booked', {
            status: 409,
            statusText: 'Conflict'
          });
        })
      );

      await expect(bookAppointmentStep(defaultInput)).rejects.toThrow(
        'Failed to book appointment: 409 Conflict'
      );
    });

    it('throws on 500 server error', async () => {
      server.use(
        http.post('https://api.example.com/api/event/book', () => {
          return new HttpResponse('Server error', {
            status: 500,
            statusText: 'Internal Server Error'
          });
        })
      );

      await expect(bookAppointmentStep(defaultInput)).rejects.toThrow(
        'Failed to book appointment: 500 Internal Server Error'
      );
    });

    it('throws on network failure', async () => {
      server.use(
        http.post('https://api.example.com/api/event/book', () => {
          return HttpResponse.error();
        })
      );

      await expect(bookAppointmentStep(defaultInput)).rejects.toThrow();
    });
  });

  describe('location types', () => {
    it('handles Telehealth location', async () => {
      let capturedBody: Record<string, unknown> | null = null;

      server.use(
        http.post(
          'https://api.example.com/api/event/book',
          async ({ request }) => {
            capturedBody = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json(mockSuccessResponse);
          }
        )
      );

      await bookAppointmentStep({
        ...defaultInput,
        locationType: 'Telehealth'
      });

      expect(capturedBody?.locationType).toBe('Telehealth');
    });

    it('handles In-Person location', async () => {
      let capturedBody: Record<string, unknown> | null = null;

      server.use(
        http.post(
          'https://api.example.com/api/event/book',
          async ({ request }) => {
            capturedBody = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json(mockSuccessResponse);
          }
        )
      );

      await bookAppointmentStep({ ...defaultInput, locationType: 'In-Person' });

      expect(capturedBody?.locationType).toBe('In-Person');
    });
  });
});
