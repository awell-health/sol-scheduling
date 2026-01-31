import { test as base, Page, Route } from '@playwright/test';
import {
  mockProviders,
  mockProviderDetails,
  mockAvailability,
  mockBookingResponse,
  mockOnboardingData,
  mockWorkflowProgress,
} from '../../mocks/fixtures';

/**
 * API mock configuration for individual tests
 */
export interface ApiMockConfig {
  /** Return empty providers list */
  emptyProviders?: boolean;
  /** Return no availability for a provider */
  noAvailability?: boolean;
  /** Simulate booking error */
  bookingError?: boolean;
  /** Simulate network error */
  networkError?: boolean;
  /** Custom providers to return */
  providers?: typeof mockProviders;
  /** Custom delay in ms */
  delay?: number;
}

/**
 * API mocking helper for Playwright E2E tests
 * 
 * Provides methods to intercept and mock API responses at the network level.
 * This is useful for testing error states, empty states, and specific data scenarios.
 */
export class ApiMockHelper {
  private config: ApiMockConfig = {};
  
  constructor(private page: Page) {}

  /**
   * Configure mock behavior for subsequent requests
   */
  configure(config: ApiMockConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset mock configuration to defaults
   */
  reset(): void {
    this.config = {};
  }

  /**
   * Set up all API route handlers
   * Call this before navigating to the page
   */
  async setupMocks(): Promise<void> {
    const { page, config } = this;

    // Mock OAuth token endpoint
    await page.route('**/oauth2/token', async (route) => {
      if (config.networkError) {
        await route.abort('failed');
        return;
      }
      if (config.delay) await this.delay(config.delay);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-playwright-token',
          token_type: 'Bearer',
          expires_in: 3600,
        }),
      });
    });

    // Mock providers list endpoint
    await page.route('**/api/v2/provider', async (route) => {
      if (config.networkError) {
        await route.abort('failed');
        return;
      }
      if (config.delay) await this.delay(config.delay);

      const providers = config.emptyProviders 
        ? [] 
        : (config.providers || mockProviders);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: providers }),
      });
    });

    // Mock single provider endpoint
    await page.route('**/api/provider/info*', async (route) => {
      if (config.networkError) {
        await route.abort('failed');
        return;
      }
      if (config.delay) await this.delay(config.delay);

      const url = new URL(route.request().url());
      const providerId = url.searchParams.get('providerId');
      const provider = providerId ? mockProviderDetails[providerId] : null;

      if (!provider) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ errorCode: 'NOT_FOUND', errorMessage: 'Provider not found' }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: provider }),
      });
    });

    // Mock availability endpoint
    await page.route('**/api/event/list', async (route) => {
      if (config.networkError) {
        await route.abort('failed');
        return;
      }
      if (config.delay) await this.delay(config.delay);

      const body = route.request().postDataJSON() as { providerId: string[] };
      const providerIds = body?.providerId || [];
      const availability: Record<string, typeof mockAvailability.slots> = {};

      for (const providerId of providerIds) {
        availability[providerId] = config.noAvailability 
          ? [] 
          : mockAvailability.slots.map(slot => ({ ...slot, providerId }));
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: availability }),
      });
    });

    // Mock booking endpoint
    await page.route('**/api/event/book', async (route) => {
      if (config.networkError) {
        await route.abort('failed');
        return;
      }
      if (config.delay) await this.delay(config.delay);

      if (config.bookingError) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify(mockBookingResponse.error),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBookingResponse.success),
      });
    });

    // Mock workflow stream endpoint (SSE)
    await page.route('**/api/workflow/*/stream', async (route) => {
      if (config.networkError) {
        await route.abort('failed');
        return;
      }

      // Simulate SSE progress events
      const events = [
        mockWorkflowProgress.booking,
        mockWorkflowProgress.fetchingDetails,
        mockWorkflowProgress.creatingPatient,
        mockWorkflowProgress.updatingLead,
        mockWorkflowProgress.startingCareflow,
        mockWorkflowProgress.complete,
      ];

      const body = events
        .map(event => `data: ${JSON.stringify(event)}\n\n`)
        .join('');

      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        headers: {
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        body,
      });
    });

    // Mock workflow status endpoint
    await page.route('**/api/workflow/*/status', async (route) => {
      if (config.networkError) {
        await route.abort('failed');
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'completed',
          result: mockWorkflowProgress.complete,
        }),
      });
    });
  }

  /**
   * Mock a specific route with custom response
   */
  async mockRoute(
    urlPattern: string | RegExp,
    response: {
      status?: number;
      body?: unknown;
      contentType?: string;
    }
  ): Promise<void> {
    await this.page.route(urlPattern, async (route) => {
      await route.fulfill({
        status: response.status || 200,
        contentType: response.contentType || 'application/json',
        body: typeof response.body === 'string' 
          ? response.body 
          : JSON.stringify(response.body),
      });
    });
  }

  /**
   * Intercept a route and allow the request to continue (for monitoring)
   */
  async interceptRoute(
    urlPattern: string | RegExp,
    handler: (route: Route, request: Request) => Promise<void>
  ): Promise<void> {
    await this.page.route(urlPattern, async (route) => {
      await handler(route, route.request() as unknown as Request);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create an API mock fixture for Playwright tests
 */
export function createApiMockFixture() {
  return base.extend<{ apiMock: ApiMockHelper }>({
    apiMock: async ({ page }, use) => {
      const helper = new ApiMockHelper(page);
      await use(helper);
    },
  });
}

// Export fixture data for use in tests
export {
  mockProviders,
  mockProviderDetails,
  mockAvailability,
  mockBookingResponse,
  mockOnboardingData,
  mockWorkflowProgress,
};
