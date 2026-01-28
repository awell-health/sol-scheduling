import { http, HttpResponse, delay } from 'msw';
import { mockProviders, mockAvailability, mockProviderDetails } from './fixtures';

/**
 * MSW handlers for SOL API endpoints
 * 
 * These handlers intercept network requests during tests and return mock data.
 * Use in unit tests via `server.use()` to override specific handlers.
 */
export const handlers = [
  // OAuth token endpoint - returns mock access token
  http.post('*/oauth2/token', async () => {
    await delay(10);
    return HttpResponse.json({
      access_token: 'mock-access-token-12345',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'read write',
    });
  }),

  // Get providers list
  http.post('*/api/v2/provider', async ({ request }) => {
    await delay(50);
    
    const body = await request.json() as {
      therapeuticModality?: string;
      location?: { state?: string };
    };
    
    // Filter providers based on request body if needed
    let filteredProviders = [...mockProviders];
    
    if (body.therapeuticModality === 'Therapy') {
      filteredProviders = filteredProviders.filter(p => p.id.includes('therapy'));
    }
    
    if (body.therapeuticModality === 'Psychiatric') {
      filteredProviders = filteredProviders.filter(p => p.id.includes('psychiatry'));
    }
    
    if (body.location?.state) {
      filteredProviders = filteredProviders.filter(
        p => p.location?.state === body.location?.state
      );
    }
    
    return HttpResponse.json({
      data: filteredProviders,
    });
  }),

  // Get single provider details
  http.get('*/api/provider/info', async ({ request }) => {
    await delay(30);
    
    const url = new URL(request.url);
    const providerId = url.searchParams.get('providerId');
    
    if (!providerId) {
      return HttpResponse.json(
        { errorCode: 'MISSING_PARAM', errorMessage: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    const provider = mockProviderDetails[providerId];
    
    if (!provider) {
      return HttpResponse.json(
        { errorCode: 'NOT_FOUND', errorMessage: `Provider ${providerId} not found` },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: provider,
    });
  }),

  // Get availability (event list)
  http.post('*/api/event/list', async ({ request }) => {
    await delay(40);
    
    const body = await request.json() as { providerId: string[] };
    const providerIds = body.providerId || [];
    
    const availability: Record<string, typeof mockAvailability.slots> = {};
    
    for (const providerId of providerIds) {
      // Return mock slots for each requested provider
      availability[providerId] = mockAvailability.slots.map(slot => ({
        ...slot,
        providerId,
      }));
    }
    
    return HttpResponse.json({
      data: availability,
    });
  }),

  // Book appointment
  http.post('*/api/event/book', async ({ request }) => {
    await delay(100);
    
    const body = await request.json() as {
      eventId: string;
      providerId: string;
      userInfo: { userName: string };
      locationType: string;
    };
    
    // Simulate validation error for specific test cases
    if (body.eventId === 'error-event-id') {
      return HttpResponse.json(
        { errorCode: 'BOOKING_FAILED', errorMessage: 'Event already booked' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      data: {
        success: true,
        eventId: body.eventId,
        providerId: body.providerId,
        confirmationNumber: `MOCK-${Date.now()}`,
      },
    });
  }),

  // Get event details
  http.get('*/api/event', async ({ request }) => {
    await delay(30);
    
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');
    
    if (!eventId) {
      return HttpResponse.json(
        { errorCode: 'MISSING_PARAM', errorMessage: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Return mock event details
    return HttpResponse.json({
      data: {
        eventId,
        providerId: 'provider-psychiatry-1',
        providerName: 'Dr. Sarah Johnson',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        facility: 'CO - Cherry Creek',
        location: 'Telehealth',
      },
    });
  }),
];

/**
 * Handler factory functions for creating custom test scenarios
 */
export const createErrorHandler = (
  endpoint: string,
  statusCode: number,
  errorMessage: string
) => {
  return http.all(`*${endpoint}`, () => {
    return HttpResponse.json(
      { errorCode: 'ERROR', errorMessage },
      { status: statusCode }
    );
  });
};

export const createEmptyProvidersHandler = () => {
  return http.post('*/api/v2/provider', () => {
    return HttpResponse.json({ data: [] });
  });
};

export const createNoAvailabilityHandler = (providerId: string) => {
  return http.post('*/api/event/list', async ({ request }) => {
    const body = await request.json() as { providerId: string[] };
    const availability: Record<string, never[]> = {};
    
    for (const id of body.providerId || []) {
      availability[id] = [];
    }
    
    return HttpResponse.json({ data: availability });
  });
};
