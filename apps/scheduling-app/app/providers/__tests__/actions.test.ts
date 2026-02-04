import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server';

// Use vi.hoisted to make mock available before vi.mock is hoisted
const { mockStart } = vi.hoisted(() => ({
  mockStart: vi.fn()
}));

// Mock sol-utils
vi.mock('../../../lib/sol-utils', () => ({
  API_METHODS: {
    GET_PROVIDERS: 'GET_PROVIDERS',
    GET_PROVIDER: 'GET_PROVIDER',
    GET_AVAILABILITY: 'GET_AVAILABILITY',
    BOOK_EVENT: 'BOOK_EVENT'
  },
  API_ROUTES: {
    GET_PROVIDERS: '/api/v2/provider',
    GET_PROVIDER: '/api/provider/info',
    GET_AVAILABILITY: '/api/event/list',
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

// Mock workflow/api - uses hoisted mockStart
vi.mock('workflow/api', () => ({
  start: mockStart
}));

// Mock lodash
vi.mock('lodash', () => ({
  isEmpty: (obj: object) => Object.keys(obj).length === 0,
  isNil: (val: unknown) => val === null || val === undefined,
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

import {
  getProvidersAction,
  getProviderAction,
  getAvailabilityAction,
  bookAppointmentAction,
  startBookingWorkflowAction
} from '../actions';

describe('SOL API Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStart.mockResolvedValue({ runId: 'mock-run-id-12345' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe('getProvidersAction', () => {
    const mockProvidersResponse = {
      data: [
        {
          id: 'provider-1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          title: 'MD',
          specialties: ['Psychiatry'],
          location: { state: 'CO' }
        },
        {
          id: 'provider-2',
          firstName: 'Michael',
          lastName: 'Chen',
          title: 'LCSW',
          specialties: ['Therapy'],
          location: { state: 'CO' }
        }
      ]
    };

    beforeEach(() => {
      server.use(
        http.post('https://api.example.com/api/v2/provider', () => {
          return HttpResponse.json(mockProvidersResponse);
        })
      );
    });

    it('returns providers with timing metadata', async () => {
      const result = await getProvidersAction({
        therapeuticModality: 'Psychiatry (Medication)',
        location: { state: 'CO' }
      });

      expect(result.data).toHaveLength(2);
      expect(result._timing).toBeDefined();
      expect(result._timing.solApiMs).toBeGreaterThanOrEqual(0);
      expect(result._meta).toBeDefined();
      expect(result._meta.providerCount).toBe(2);
    });

    it('sanitizes empty string filters', async () => {
      let capturedBody: Record<string, unknown> | null = null;

      server.use(
        http.post(
          'https://api.example.com/api/v2/provider',
          async ({ request }) => {
            capturedBody = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json(mockProvidersResponse);
          }
        )
      );

      await getProvidersAction({
        therapeuticModality: 'Psychiatry (Medication)',
        location: { state: 'CO' },
        age: '' // Should be filtered out
      });

      expect(capturedBody).not.toHaveProperty('age');
    });

    it('sanitizes null and undefined filters', async () => {
      let capturedBody: Record<string, unknown> | null = null;

      server.use(
        http.post(
          'https://api.example.com/api/v2/provider',
          async ({ request }) => {
            capturedBody = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json(mockProvidersResponse);
          }
        )
      );

      await getProvidersAction({
        therapeuticModality: 'Psychiatry (Medication)',
        location: { state: 'CO' },
        // @ts-expect-error - testing runtime behavior with null
        gender: null
      });

      expect(capturedBody).not.toHaveProperty('gender');
    });

    it('sanitizes empty arrays', async () => {
      let capturedBody: Record<string, unknown> | null = null;

      server.use(
        http.post(
          'https://api.example.com/api/v2/provider',
          async ({ request }) => {
            capturedBody = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json(mockProvidersResponse);
          }
        )
      );

      await getProvidersAction({
        therapeuticModality: 'Psychiatry (Medication)',
        location: { state: 'CO' },
        // @ts-expect-error - testing runtime behavior
        tags: []
      });

      expect(capturedBody).not.toHaveProperty('tags');
    });

    it('handles API errors', async () => {
      server.use(
        http.post('https://api.example.com/api/v2/provider', () => {
          return new HttpResponse('Internal Server Error', {
            status: 500,
            statusText: 'Internal Server Error'
          });
        })
      );

      await expect(
        getProvidersAction({
          therapeuticModality: 'Psychiatry (Medication)',
          location: { state: 'CO' }
        })
      ).rejects.toThrow('SOL request failed');
    });

    it('handles empty provider list', async () => {
      server.use(
        http.post('https://api.example.com/api/v2/provider', () => {
          return HttpResponse.json({ data: [] });
        })
      );

      const result = await getProvidersAction({
        therapeuticModality: 'Psychiatry (Medication)',
        location: { state: 'CO' }
      });

      expect(result.data).toEqual([]);
      expect(result._meta.providerCount).toBe(0);
    });
  });

  describe('getProviderAction', () => {
    const mockProvider = {
      id: 'provider-123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'MD',
      bio: 'Board-certified psychiatrist',
      specialties: ['ADHD', 'Anxiety', 'Depression'],
      image: 'https://example.com/image.jpg'
    };

    beforeEach(() => {
      server.use(
        http.get('https://api.example.com/api/provider/info', ({ request }) => {
          const url = new URL(request.url);
          const providerId = url.searchParams.get('providerId');

          if (providerId === 'provider-123') {
            return HttpResponse.json({ data: mockProvider });
          }

          return new HttpResponse('Provider not found', {
            status: 404,
            statusText: 'Not Found'
          });
        })
      );
    });

    it('returns provider with timing metadata', async () => {
      const result = await getProviderAction('provider-123');

      // Use toMatchObject since schema may strip fields
      expect(result.data).toMatchObject({
        id: 'provider-123',
        firstName: 'Sarah',
        lastName: 'Johnson'
      });
      expect(result._timing).toBeDefined();
      expect(result._timing.solApiMs).toBeGreaterThanOrEqual(0);
    });

    it('throws error for empty provider ID', async () => {
      await expect(getProviderAction('')).rejects.toThrow(
        'Provider ID is required'
      );
    });

    it('throws error for null provider ID', async () => {
      // @ts-expect-error - testing runtime behavior
      await expect(getProviderAction(null)).rejects.toThrow(
        'Provider ID is required'
      );
    });

    it('handles provider not found', async () => {
      await expect(getProviderAction('nonexistent-provider')).rejects.toThrow(
        'SOL request failed'
      );
    });

    it('handles API errors', async () => {
      server.use(
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse('Server Error', {
            status: 500,
            statusText: 'Internal Server Error'
          });
        })
      );

      await expect(getProviderAction('provider-123')).rejects.toThrow(
        'SOL request failed'
      );
    });
  });

  describe('getAvailabilityAction', () => {
    // Mock slots must match ProviderEventSchema requirements:
    // eventId, date, providerId, slotstart, duration, facility (required), eventType (required)
    const mockSlots = [
      {
        eventId: 'event-1',
        date: '2024-06-20T14:00:00Z',
        providerId: 'provider-123',
        slotstart: '2024-06-20T14:00:00Z',
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: 'Telehealth',
        eventType: 'Telehealth',
        booked: false
      },
      {
        eventId: 'event-2',
        date: '2024-06-21T10:00:00Z',
        providerId: 'provider-123',
        slotstart: '2024-06-21T10:00:00Z',
        duration: 60,
        facility: 'CO - Denver',
        location: 'In-Person',
        eventType: 'In-Person',
        booked: false
      }
    ];

    beforeEach(() => {
      server.use(
        http.post(
          'https://api.example.com/api/event/list',
          async ({ request }) => {
            const body = (await request.json()) as { providerId: string[] };
            const availability: Record<string, typeof mockSlots> = {};

            for (const providerId of body.providerId || []) {
              availability[providerId] = mockSlots.map((slot) => ({
                ...slot,
                providerId
              }));
            }

            return HttpResponse.json({ data: availability });
          }
        )
      );
    });

    it('returns availability with timing metadata', async () => {
      const result = await getAvailabilityAction('provider-123');

      expect(result.data).toBeDefined();
      expect(result.data['provider-123']).toHaveLength(2);
      expect(result._timing).toBeDefined();
      expect(result._timing.solApiMs).toBeGreaterThanOrEqual(0);
    });

    it('throws error for empty provider ID', async () => {
      await expect(getAvailabilityAction('')).rejects.toThrow(
        'Provider ID is required'
      );
    });

    it('handles no availability', async () => {
      server.use(
        http.post('https://api.example.com/api/event/list', () => {
          return HttpResponse.json({ data: { 'provider-123': [] } });
        })
      );

      const result = await getAvailabilityAction('provider-123');
      expect(result.data['provider-123']).toEqual([]);
    });

    it('handles API errors', async () => {
      server.use(
        http.post('https://api.example.com/api/event/list', () => {
          return new HttpResponse('Server Error', {
            status: 500,
            statusText: 'Internal Server Error'
          });
        })
      );

      await expect(getAvailabilityAction('provider-123')).rejects.toThrow(
        'SOL request failed'
      );
    });
  });

  describe('bookAppointmentAction', () => {
    const defaultPayload = {
      eventId: 'event-123',
      providerId: 'provider-456',
      userInfo: { userName: 'John Doe', salesforceLeadId: 'lead-789' },
      locationType: 'Telehealth',
      patientTimezone: 'America/Denver',
      clinicalFocus: 'ADHD'
    };

    const mockBookingResponse = {
      data: {
        success: true,
        eventId: 'event-123',
        confirmationNumber: 'CONF-12345'
      }
    };

    beforeEach(() => {
      delete process.env.MOCK_BOOKING_RESPONSE;

      server.use(
        http.post('https://api.example.com/api/event/book', () => {
          return HttpResponse.json(mockBookingResponse);
        })
      );
    });

    afterEach(() => {
      delete process.env.MOCK_BOOKING_RESPONSE;
    });

    it('books appointment and starts post-booking workflow', async () => {
      const result = await bookAppointmentAction(defaultPayload);

      expect(result.data).toEqual(mockBookingResponse.data);
      expect(result._timing).toBeDefined();
      expect(mockStart).toHaveBeenCalledWith(
        expect.anything(), // postBookingWorkflow
        [
          expect.objectContaining({
            eventId: 'event-123',
            providerId: 'provider-456',
            salesforceLeadId: 'lead-789',
            clinicalFocus: 'ADHD',
            patientTimezone: 'America/Denver'
          })
        ]
      );
    });

    it('sends correct payload to SOL API (excludes extra fields)', async () => {
      let capturedBody: Record<string, unknown> | null = null;

      server.use(
        http.post(
          'https://api.example.com/api/event/book',
          async ({ request }) => {
            capturedBody = (await request.json()) as Record<string, unknown>;
            return HttpResponse.json(mockBookingResponse);
          }
        )
      );

      await bookAppointmentAction(defaultPayload);

      // Should only include SOL API fields validated by BookAppointmentInputSchema
      // salesforceLeadId is stripped by Zod since it's not in the schema
      expect(capturedBody).toEqual({
        eventId: 'event-123',
        providerId: 'provider-456',
        userInfo: { userName: 'John Doe' },
        locationType: 'Telehealth'
      });
    });

    describe('mock mode (MOCK_BOOKING_RESPONSE=true)', () => {
      beforeEach(() => {
        process.env.MOCK_BOOKING_RESPONSE = 'true';
      });

      it('returns mocked response without calling API', async () => {
        let apiCalled = false;

        server.use(
          http.post('https://api.example.com/api/event/book', () => {
            apiCalled = true;
            return HttpResponse.json(mockBookingResponse);
          })
        );

        const result = await bookAppointmentAction(defaultPayload);

        expect(apiCalled).toBe(false);
        expect(result.data).toEqual({ mocked: true, eventId: 'event-123' });
        expect(result._timing.solApiMs).toBe(0);
      });
    });

    it('handles booking errors', async () => {
      server.use(
        http.post('https://api.example.com/api/event/book', () => {
          return new HttpResponse('Event already booked', {
            status: 409,
            statusText: 'Conflict'
          });
        })
      );

      await expect(bookAppointmentAction(defaultPayload)).rejects.toThrow(
        'SOL request failed'
      );
    });
  });

  describe('startBookingWorkflowAction', () => {
    const defaultPayload = {
      eventId: 'event-123',
      providerId: 'provider-456',
      userName: 'John Doe',
      salesforceLeadId: 'lead-789',
      locationType: 'Telehealth',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+13035551234',
      state: 'CO',
      patientTimezone: 'America/Denver',
      clinicalFocus: 'ADHD'
    };

    beforeEach(() => {
      mockStart.mockClear();
      mockStart.mockResolvedValue({ runId: 'mock-run-id-12345' });
    });

    it('starts workflow and returns runId', async () => {
      const result = await startBookingWorkflowAction(defaultPayload);

      expect(result).toEqual({ runId: 'mock-run-id-12345' });
    });

    it('passes all parameters to workflow', async () => {
      await startBookingWorkflowAction(defaultPayload);

      expect(mockStart).toHaveBeenCalledWith(
        expect.anything(), // bookingWorkflow
        [
          expect.objectContaining({
            eventId: 'event-123',
            providerId: 'provider-456',
            userName: 'John Doe',
            salesforceLeadId: 'lead-789',
            locationType: 'Telehealth',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+13035551234',
            state: 'CO',
            patientTimezone: 'America/Denver',
            clinicalFocus: 'ADHD'
          })
        ]
      );
    });

    it('handles optional parameters', async () => {
      mockStart.mockClear();

      const minimalPayload = {
        eventId: 'event-123',
        providerId: 'provider-456',
        userName: 'John Doe',
        salesforceLeadId: 'lead-789',
        locationType: 'Telehealth',
        firstName: 'John',
        lastName: 'Doe'
      };

      await startBookingWorkflowAction(minimalPayload);

      expect(mockStart).toHaveBeenCalledWith(expect.anything(), [
        expect.objectContaining({
          eventId: 'event-123',
          providerId: 'provider-456',
          // Optional fields should be undefined, not missing
          phone: undefined,
          state: undefined,
          patientTimezone: undefined,
          clinicalFocus: undefined
        })
      ]);
    });
  });
});
