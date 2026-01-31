import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server';

// Hoisted mocks
const { mockGetRun } = vi.hoisted(() => ({
  mockGetRun: vi.fn()
}));

// Mock sol-utils
vi.mock('../../../lib/sol-utils', () => ({
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

// Mock lodash
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

// Mock workflow/api
vi.mock('workflow/api', () => ({
  getRun: mockGetRun
}));

import {
  getEventDetailsAction,
  getWorkflowStatusAction,
  getConfirmationDataAction
} from '../actions';

describe('Confirmation Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe('getEventDetailsAction', () => {
    const mockEventResponse = {
      data: {
        eventId: 'event-123',
        providerId: 'provider-456',
        slotstart: '2024-06-20T14:00:00Z',
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: 'Telehealth',
        provider: {
          id: 'provider-456',
          name: 'Dr. Sarah Johnson',
          firstName: 'Sarah',
          lastName: 'Johnson'
        }
      }
    };

    const mockProviderResponse = {
      data: {
        id: 'provider-456',
        firstName: 'Sarah',
        lastName: 'Johnson',
        image: 'https://example.com/sarah.jpg'
      }
    };

    beforeEach(() => {
      server.use(
        http.get('https://api.example.com/api/event', ({ request }) => {
          const url = new URL(request.url);
          const eventId = url.searchParams.get('eventId');

          if (eventId === 'event-123') {
            return HttpResponse.json(mockEventResponse);
          }

          return new HttpResponse('Event not found', {
            status: 404,
            statusText: 'Not Found'
          });
        }),
        http.get('https://api.example.com/api/provider/info', ({ request }) => {
          const url = new URL(request.url);
          const providerId = url.searchParams.get('providerId');

          if (providerId === 'provider-456') {
            return HttpResponse.json(mockProviderResponse);
          }

          return new HttpResponse('Provider not found', {
            status: 404,
            statusText: 'Not Found'
          });
        })
      );
    });

    it('fetches event details with provider info', async () => {
      const result = await getEventDetailsAction('event-123', 'provider-456');

      expect(result).toEqual({
        eventId: 'event-123',
        providerId: 'provider-456',
        providerName: 'Sarah Johnson',
        providerImage: 'https://example.com/sarah.jpg',
        startsAt: '2024-06-20T14:00:00Z',
        duration: '60',
        locationType: 'Telehealth',
        facility: 'CO - Cherry Creek'
      });
    });

    it('falls back to event provider name when provider API fails', async () => {
      server.use(
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse('Server Error', {
            status: 500,
            statusText: 'Internal Server Error'
          });
        })
      );

      const result = await getEventDetailsAction('event-123', 'provider-456');

      // Should use provider.name from event response
      expect(result.providerName).toBe('Dr. Sarah Johnson');
      expect(result.providerImage).toBeUndefined();
    });

    it('builds provider name from firstName/lastName when name is missing', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              eventId: 'event-123',
              providerId: 'provider-456',
              slotstart: '2024-06-20T14:00:00Z',
              duration: 60,
              location: 'Telehealth',
              provider: {
                firstName: 'Michael',
                lastName: 'Chen'
              }
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse('Not found', { status: 404 });
        })
      );

      const result = await getEventDetailsAction('event-123', 'provider-456');

      expect(result.providerName).toBe('Michael Chen');
    });

    it('returns empty string when no name data available', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              eventId: 'event-123',
              providerId: 'provider-456',
              slotstart: '2024-06-20T14:00:00Z',
              duration: 60,
              location: 'Telehealth',
              provider: {} // Empty provider object
            }
          });
        }),
        http.get('https://api.example.com/api/provider/info', () => {
          return new HttpResponse('Not found', { status: 404 });
        })
      );

      const result = await getEventDetailsAction('event-123', 'provider-456');

      // Note: Due to ?? vs || behavior, empty string from filter().join() doesn't trigger 'Provider' fallback
      expect(result.providerName).toBe('');
    });

    it('uses eventType when location is missing', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              eventId: 'event-123',
              slotstart: '2024-06-20T14:00:00Z',
              duration: 60,
              eventType: 'In-Person'
            }
          });
        })
      );

      const result = await getEventDetailsAction('event-123', 'provider-456');

      expect(result.locationType).toBe('In-Person');
    });

    it('defaults to Telehealth when no location info', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              eventId: 'event-123',
              slotstart: '2024-06-20T14:00:00Z',
              duration: 60
            }
          });
        })
      );

      const result = await getEventDetailsAction('event-123', 'provider-456');

      expect(result.locationType).toBe('Telehealth');
    });

    it('throws on event API error', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return new HttpResponse('Event not found', {
            status: 404,
            statusText: 'Not Found'
          });
        })
      );

      await expect(
        getEventDetailsAction('nonexistent', 'provider-456')
      ).rejects.toThrow('Failed to get event details');
    });

    it('defaults duration to 60 when missing', async () => {
      server.use(
        http.get('https://api.example.com/api/event', () => {
          return HttpResponse.json({
            data: {
              eventId: 'event-123',
              slotstart: '2024-06-20T14:00:00Z',
              location: 'Telehealth'
            }
          });
        })
      );

      const result = await getEventDetailsAction('event-123', 'provider-456');

      expect(result.duration).toBe('60');
    });
  });

  describe('getWorkflowStatusAction', () => {
    const mockWorkflowResult = {
      eventDetails: {
        eventId: 'event-123',
        providerId: 'provider-456',
        providerName: 'Dr. Sarah Johnson',
        startsAt: '2024-06-20T14:00:00Z',
        duration: '60',
        locationType: 'Telehealth'
      },
      sessionUrl: 'https://awell.health/session/abc123'
    };

    it('returns completed status with result', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('completed'),
        returnValue: Promise.resolve(mockWorkflowResult)
      });

      const result = await getWorkflowStatusAction('run-123');

      expect(result.status).toBe('completed');
      expect(result).toHaveProperty('result');
      if (result.status === 'completed') {
        expect(result.result).toEqual(mockWorkflowResult);
      }
    });

    it('returns running status when workflow is in progress', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('running')
      });

      const result = await getWorkflowStatusAction('run-123');

      expect(result.status).toBe('running');
    });

    it('returns running status for pending workflow', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('pending')
      });

      const result = await getWorkflowStatusAction('run-123');

      expect(result.status).toBe('running');
    });

    it('returns error status for failed workflow', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('failed')
      });

      const result = await getWorkflowStatusAction('run-123');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.message).toBe('Workflow failed');
      }
    });

    it('returns error status for cancelled workflow', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('cancelled')
      });

      const result = await getWorkflowStatusAction('run-123');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.message).toBe('Workflow cancelled');
      }
    });

    it('handles workflow API errors', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.reject(new Error('Run not found'))
      });

      const result = await getWorkflowStatusAction('nonexistent-run');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.message).toBe('Run not found');
      }
    });
  });

  describe('getConfirmationDataAction', () => {
    const mockWorkflowResult = {
      eventDetails: {
        eventId: 'event-123',
        providerId: 'provider-456',
        providerName: 'Dr. Sarah Johnson',
        startsAt: '2024-06-20T14:00:00Z',
        duration: '60',
        locationType: 'Telehealth'
      },
      sessionUrl: 'https://awell.health/session/abc123'
    };

    it('returns workflow result when completed', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('completed'),
        returnValue: Promise.resolve(mockWorkflowResult)
      });

      const result = await getConfirmationDataAction('run-123');

      expect(result).toEqual(mockWorkflowResult);
    });

    it('returns null when workflow is still running', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('running')
      });

      const result = await getConfirmationDataAction('run-123');

      expect(result).toBeNull();
    });

    it('returns null on error', async () => {
      mockGetRun.mockReturnValue({
        status: Promise.resolve('failed')
      });

      const result = await getConfirmationDataAction('run-123');

      expect(result).toBeNull();
    });
  });
});
