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
    GET_EVENT: 'GET_EVENT',
    GET_PROVIDER: 'GET_PROVIDER'
  },
  API_ROUTES: {
    GET_EVENT: '/api/event',
    GET_PROVIDER: '/api/provider/info'
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
  fetchEventDetailsStep,
  type FetchEventDetailsInput
} from '../steps/fetchEventDetails';

describe('fetchEventDetailsStep', () => {
  const defaultInput: FetchEventDetailsInput = {
    eventId: 'event-123',
    providerId: 'provider-456'
  };

  const mockEventResponse = {
    data: {
      eventId: 'event-123',
      providerId: 'provider-456',
      slotstart: '2024-06-20T14:00:00.000Z',
      duration: 60,
      location: 'Telehealth',
      eventType: 'Telehealth',
      facility: 'CO - Cherry Creek',
      provider: {
        id: 'provider-456',
        name: 'Dr. Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        image: '/images/event-provider.jpg'
      }
    }
  };

  const mockProviderResponse = {
    data: {
      id: 'provider-456',
      firstName: 'Sarah',
      lastName: 'Johnson',
      image: '/images/provider-detail.jpg'
    }
  };

  const setupDefaultHandlers = () => {
    server.use(
      http.get('https://api.example.com/api/event', () => {
        return HttpResponse.json(mockEventResponse);
      }),
      http.get('https://api.example.com/api/provider/info', () => {
        return HttpResponse.json(mockProviderResponse);
      })
    );
  };

  beforeEach(() => {
    setupDefaultHandlers();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe('successful parallel fetch', () => {
    it('returns complete event details', async () => {
      const result = await fetchEventDetailsStep(defaultInput);

      expect(result).toEqual({
        eventId: 'event-123',
        providerId: 'provider-456',
        providerName: 'Sarah Johnson',
        providerFirstName: 'Sarah',
        providerLastName: 'Johnson',
        providerImage: '/images/provider-detail.jpg', // Uses provider endpoint data
        startsAt: '2024-06-20T14:00:00.000Z',
        duration: '60',
        locationType: 'Telehealth',
        facility: 'CO - Cherry Creek'
      });
    });
  });

  describe('provider name fallback logic', () => {
    it('uses provider endpoint firstName/lastName over event data', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              provider: {
                name: 'Event Provider Name',
                firstName: 'Event',
                lastName: 'Name'
              }
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return HttpResponse.json({
            data: {
              firstName: 'Provider',
              lastName: 'Endpoint'
            }
          });
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.providerName).toBe('Provider Endpoint');
      expect(result.providerFirstName).toBe('Provider');
      expect(result.providerLastName).toBe('Endpoint');
    });

    it('falls back to event provider.name when firstName/lastName unavailable', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              provider: {
                name: 'Dr. Full Name'
              }
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.providerName).toBe('Dr. Full Name');
    });

    it('falls back to "Provider" when no name data available', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              provider: null
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.providerName).toBe('Provider');
    });

    it('constructs name from partial data (firstName only)', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              provider: {
                firstName: 'OnlyFirst'
              }
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.providerName).toBe('OnlyFirst');
    });
  });

  describe('provider image fallback', () => {
    it('uses provider endpoint image over event data', async () => {
      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.providerImage).toBe('/images/provider-detail.jpg');
    });

    it('falls back to event provider image when provider endpoint fails', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json(mockEventResponse);
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.providerImage).toBe('/images/event-provider.jpg');
    });
  });

  describe('ID fallback logic', () => {
    it('uses event data IDs over input IDs', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              eventId: 'event-from-api',
              providerId: 'provider-from-api'
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return HttpResponse.json(mockProviderResponse);
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.eventId).toBe('event-from-api');
      expect(result.providerId).toBe('provider-from-api');
    });

    it('falls back to input IDs when API returns null', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              eventId: null,
              providerId: null,
              provider: { id: null }
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return HttpResponse.json(mockProviderResponse);
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.eventId).toBe('event-123');
      expect(result.providerId).toBe('provider-456');
    });
  });

  describe('location type fallback', () => {
    it('uses location field when available', async () => {
      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.locationType).toBe('Telehealth');
    });

    it('falls back to eventType when location is null', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              location: null,
              eventType: 'In-Person'
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return HttpResponse.json(mockProviderResponse);
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.locationType).toBe('In-Person');
    });

    it('defaults to "Telehealth" when both are null', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              location: null,
              eventType: null
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return HttpResponse.json(mockProviderResponse);
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.locationType).toBe('Telehealth');
    });
  });

  describe('duration handling', () => {
    it('converts duration to string', async () => {
      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.duration).toBe('60');
      expect(typeof result.duration).toBe('string');
    });

    it('defaults to "60" when duration is null', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              ...mockEventResponse.data,
              duration: null
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return HttpResponse.json(mockProviderResponse);
        })
      );

      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.duration).toBe('60');
    });
  });

  describe('API errors', () => {
    it('throws when event API fails', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return new HttpResponse('Event not found', {
            status: 404,
            statusText: 'Not Found'
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return HttpResponse.json(mockProviderResponse);
        })
      );

      await expect(fetchEventDetailsStep(defaultInput)).rejects.toThrow(
        'Failed to get event details: 404 Not Found'
      );
    });

    it('continues when provider API fails (non-critical)', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json(mockEventResponse);
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      // Should not throw - provider endpoint failure is non-critical
      const result = await fetchEventDetailsStep(defaultInput);

      expect(result.eventId).toBe('event-123');
      // Falls back to event provider data
      expect(result.providerImage).toBe('/images/event-provider.jpg');
    });
  });
});
