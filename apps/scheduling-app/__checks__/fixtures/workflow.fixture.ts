import { test as base, Page, Route } from '@playwright/test';
import { mockWorkflowProgress, mockSalesforceData } from '../../mocks/fixtures';

/**
 * Workflow step types emitted during booking
 */
export type WorkflowStepType =
  | 'booking_started'
  | 'appointment_booked'
  | 'careflow_started'
  | 'session_ready';

/**
 * Workflow progress event structure
 */
export interface WorkflowProgressEvent {
  type: WorkflowStepType;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Mock booking workflow result
 */
export interface MockBookingResult {
  confirmationId: string;
  salesforceLeadId: string;
  eventDetails: {
    eventId: string;
    providerId: string;
    providerFirstName: string;
    providerLastName: string;
    startsAt: string;
    duration: number;
    facility: string;
    locationType: string;
  };
  careflowId: string;
  patientId: string;
  sessionUrl: string;
}

/**
 * Configuration for workflow mocking
 */
export interface WorkflowMockConfig {
  /** Simulate workflow failure */
  shouldFail?: boolean;
  /** Error message for failed workflows */
  errorMessage?: string;
  /** Delay between progress events (ms) */
  progressDelay?: number;
  /** Custom booking result data */
  customResult?: Partial<MockBookingResult>;
  /** Custom progress events */
  customProgress?: WorkflowProgressEvent[];
}

/**
 * Workflow mock helper for E2E tests.
 *
 * Intercepts workflow-related API endpoints to:
 * 1. Prevent real workflows from running
 * 2. Simulate workflow progress via SSE
 * 3. Return mock confirmation data
 *
 * This is essential for E2E tests because:
 * - Real workflows trigger external services (Awell, Salesforce, SOL API)
 * - Workflows are durable and can't be easily rolled back
 * - Real workflows take time and add test flakiness
 *
 * @example
 * ```ts
 * test('booking shows confirmation', async ({ page, workflowMock }) => {
 *   // Set up workflow mocks before navigation
 *   await workflowMock.setupMocks();
 *
 *   // Navigate and complete booking flow...
 *   await page.goto('/providers/123');
 *
 *   // Booking will use mocked workflow
 *   await page.click('[data-testid="book-button"]');
 *
 *   // Assert confirmation page shows mock data
 *   await expect(page.getByText('mock-confirmation-id')).toBeVisible();
 * });
 * ```
 */
export class WorkflowMockHelper {
  private config: WorkflowMockConfig = {};
  private interceptedRequests: Array<{
    url: string;
    method: string;
    body?: unknown;
    timestamp: Date;
  }> = [];

  constructor(private page: Page) {}

  /**
   * Configure mock behavior
   */
  configure(config: WorkflowMockConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset configuration to defaults
   */
  reset(): void {
    this.config = {};
    this.interceptedRequests = [];
  }

  /**
   * Get all intercepted workflow requests (for assertions)
   */
  getInterceptedRequests() {
    return [...this.interceptedRequests];
  }

  /**
   * Generate a mock confirmation ID
   */
  private generateConfirmationId(): string {
    return `mock-confirmation-${Date.now()}`;
  }

  /**
   * Generate mock booking result
   */
  private generateMockResult(leadId?: string): MockBookingResult {
    const confirmationId =
      this.config.customResult?.confirmationId ?? this.generateConfirmationId();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    return {
      confirmationId,
      salesforceLeadId:
        leadId ??
        this.config.customResult?.salesforceLeadId ??
        mockSalesforceData.leadId,
      eventDetails: {
        eventId: 'mock-event-id',
        providerId: 'mock-provider-id',
        providerFirstName: 'Sarah',
        providerLastName: 'Johnson',
        startsAt: tomorrow.toISOString(),
        duration: 60,
        facility: 'CO - Cherry Creek',
        locationType: 'Telehealth',
        ...this.config.customResult?.eventDetails
      },
      careflowId: this.config.customResult?.careflowId ?? 'mock-careflow-id',
      patientId: this.config.customResult?.patientId ?? 'mock-patient-id',
      sessionUrl:
        this.config.customResult?.sessionUrl ??
        'https://intake.example.com/mock-session'
    };
  }

  /**
   * Generate SSE body for workflow progress stream
   */
  private generateSSEBody(result: MockBookingResult): string {
    const events: WorkflowProgressEvent[] = this.config.customProgress ?? [
      {
        type: 'booking_started',
        message: 'Confirming the date/time of your appointment...'
      },
      {
        type: 'appointment_booked',
        message: 'Coordinating with your provider...',
        data: { eventId: result.eventDetails.eventId }
      },
      {
        type: 'careflow_started',
        message: 'Ensuring your intake forms are ready...',
        data: { careflowId: result.careflowId, patientId: result.patientId }
      },
      {
        type: 'session_ready',
        message: 'Done! Redirecting...',
        data: {
          sessionUrl: result.sessionUrl,
          confirmationId: result.confirmationId
        }
      }
    ];

    return events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('');
  }

  /**
   * Set up all workflow-related route interceptors.
   * Call this before navigating to pages that trigger workflows.
   */
  async setupMocks(): Promise<void> {
    const { page, config } = this;

    // Mock the booking start endpoint (POST /api/booking/start)
    await page.route('**/api/booking/start', async (route) => {
      const request = route.request();
      let body: unknown;

      try {
        body = request.postDataJSON();
      } catch {
        body = request.postData();
      }

      this.interceptedRequests.push({
        url: request.url(),
        method: request.method(),
        body,
        timestamp: new Date()
      });

      if (config.shouldFail) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: config.errorMessage ?? 'Workflow failed'
          })
        });
        return;
      }

      // Extract salesforceLeadId from request body if present
      const salesforceLeadId =
        typeof body === 'object' && body !== null && 'salesforceLeadId' in body
          ? (body as { salesforceLeadId?: string }).salesforceLeadId
          : undefined;

      const result = this.generateMockResult(salesforceLeadId);

      // Return the mock result with confirmationId
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          confirmationId: result.confirmationId
        })
      });
    });

    // Mock workflow progress stream (GET /api/booking/[id]/stream)
    await page.route('**/api/booking/*/stream', async (route) => {
      const request = route.request();

      this.interceptedRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date()
      });

      if (config.shouldFail) {
        await route.fulfill({
          status: 500,
          contentType: 'text/event-stream',
          body: `data: ${JSON.stringify({ type: 'error', message: config.errorMessage ?? 'Workflow failed' })}\n\n`
        });
        return;
      }

      const result = this.generateMockResult();
      const sseBody = this.generateSSEBody(result);

      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        headers: {
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive'
        },
        body: sseBody
      });
    });

    // Mock workflow status endpoint (GET /api/booking/[id]/status)
    await page.route('**/api/booking/*/status', async (route) => {
      const request = route.request();

      this.interceptedRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date()
      });

      if (config.shouldFail) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'failed',
            error: config.errorMessage ?? 'Workflow failed'
          })
        });
        return;
      }

      const result = this.generateMockResult();

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'completed',
          result
        })
      });
    });

    // Mock workflow result endpoint (GET /api/booking/[id])
    await page.route(/\/api\/booking\/[^/]+$/, async (route) => {
      const request = route.request();

      // Only intercept GET requests (not POST to /api/booking/start)
      if (request.method() !== 'GET') {
        await route.continue();
        return;
      }

      this.interceptedRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date()
      });

      if (config.shouldFail) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Workflow not found' })
        });
        return;
      }

      const result = this.generateMockResult();

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(result)
      });
    });

    // Mock Salesforce lead creation (intercepts server action calls)
    // This prevents real leads from being created when phone is submitted
    await page.route('**/providers/_lib/salesforce/actions*', async (route) => {
      const request = route.request();

      this.interceptedRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date()
      });

      // Let the request continue but we'll mock at API level
      await route.continue();
    });
  }

  /**
   * Assert that a workflow was started with expected data
   */
  assertWorkflowStarted(
    expectedData?: Partial<{ salesforceLeadId: string; eventId: string }>
  ) {
    const startRequests = this.interceptedRequests.filter(
      (r) => r.url.includes('/api/booking/start') && r.method === 'POST'
    );

    if (startRequests.length === 0) {
      throw new Error('No workflow start request was intercepted');
    }

    if (expectedData) {
      const lastRequest = startRequests[startRequests.length - 1];
      const body = lastRequest.body as Record<string, unknown>;

      if (
        expectedData.salesforceLeadId &&
        body?.salesforceLeadId !== expectedData.salesforceLeadId
      ) {
        throw new Error(
          `Expected salesforceLeadId "${expectedData.salesforceLeadId}" but got "${body?.salesforceLeadId}"`
        );
      }

      if (expectedData.eventId && body?.eventId !== expectedData.eventId) {
        throw new Error(
          `Expected eventId "${expectedData.eventId}" but got "${body?.eventId}"`
        );
      }
    }
  }
}

/**
 * Create workflow mock fixture
 */
export function createWorkflowMockFixture() {
  return base.extend<{ workflowMock: WorkflowMockHelper }>({
    workflowMock: async ({ page }, use) => {
      const helper = new WorkflowMockHelper(page);
      await use(helper);
    }
  });
}

/**
 * Default workflow mock fixture
 */
export const workflowMockTest = createWorkflowMockFixture();
