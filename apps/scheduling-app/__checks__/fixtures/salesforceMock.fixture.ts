import { test as base, Page } from '@playwright/test';
import { mockSalesforceData } from '../../mocks/fixtures';

/**
 * Configuration for Salesforce API mocking
 */
export interface SalesforceMockConfig {
  /** Mock lead ID to return for create operations */
  leadId?: string;
  /** Simulate API errors */
  shouldFail?: boolean;
  /** Error message for failed operations */
  errorMessage?: string;
  /** Custom lead data to return */
  customLead?: Partial<typeof mockSalesforceData.lead>;
  /** Simulate duplicate lead detection */
  simulateDuplicate?: boolean;
  /** Existing lead ID for duplicate scenario */
  duplicateLeadId?: string;
}

/**
 * Tracked Salesforce API call
 */
interface TrackedCall {
  type: 'auth' | 'createLead' | 'updateLead' | 'getLead' | 'deleteLead';
  url: string;
  method: string;
  body?: unknown;
  timestamp: Date;
}

/**
 * Salesforce API mock helper.
 *
 * Intercepts all Salesforce API calls at the network level to:
 * 1. Prevent real API calls to Salesforce
 * 2. Return mock data for lead operations
 * 3. Track API calls for assertions
 *
 * This is used for fully mocked E2E tests where no external
 * services should be contacted.
 *
 * @example
 * ```ts
 * test('onboarding creates lead', async ({ page, salesforceMock }) => {
 *   await salesforceMock.setupMocks();
 *
 *   await page.goto('/providers');
 *   await page.fill('[data-testid="phone-input"]', '+15551234567');
 *   await page.click('[data-testid="submit"]');
 *
 *   // Assert Salesforce was called with correct data
 *   salesforceMock.assertLeadCreated({ Phone: '+15551234567' });
 * });
 * ```
 */
export class SalesforceMockHelper {
  private config: SalesforceMockConfig = {};
  private trackedCalls: TrackedCall[] = [];
  private mockLeadCounter = 0;

  constructor(private page: Page) {}

  /**
   * Configure mock behavior
   */
  configure(config: SalesforceMockConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset configuration and tracked calls
   */
  reset(): void {
    this.config = {};
    this.trackedCalls = [];
    this.mockLeadCounter = 0;
  }

  /**
   * Get all tracked API calls
   */
  getTrackedCalls(): TrackedCall[] {
    return [...this.trackedCalls];
  }

  /**
   * Get calls filtered by type
   */
  getCallsByType(type: TrackedCall['type']): TrackedCall[] {
    return this.trackedCalls.filter((c) => c.type === type);
  }

  /**
   * Generate a mock lead ID
   */
  private generateMockLeadId(): string {
    this.mockLeadCounter++;
    return (
      this.config.leadId ?? `00Q_MOCK_${Date.now()}_${this.mockLeadCounter}`
    );
  }

  /**
   * Build mock lead data
   */
  private buildMockLead(id: string): typeof mockSalesforceData.lead {
    return {
      ...mockSalesforceData.lead,
      ...this.config.customLead,
      Id: id
    };
  }

  /**
   * Set up all Salesforce API route interceptors.
   * Call this before navigating to pages that interact with Salesforce.
   */
  async setupMocks(): Promise<void> {
    const { page, config } = this;

    // Match Salesforce domains (both production and sandbox patterns)
    const salesforcePattern = /\.my\.salesforce\.com|\.salesforce\.com/;

    // Mock OAuth token endpoint
    await page.route('**/services/oauth2/token', async (route) => {
      this.trackedCalls.push({
        type: 'auth',
        url: route.request().url(),
        method: route.request().method(),
        timestamp: new Date()
      });

      if (config.shouldFail) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'invalid_client',
            error_description: config.errorMessage ?? 'Mock auth failure'
          })
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-salesforce-access-token',
          instance_url: 'https://mock.my.salesforce.com',
          token_type: 'Bearer',
          issued_at: Date.now().toString()
        })
      });
    });

    // Mock Lead create endpoint
    await page.route('**/services/data/*/sobjects/Lead/', async (route) => {
      const request = route.request();

      if (request.method() !== 'POST') {
        await route.continue();
        return;
      }

      let body: unknown;
      try {
        body = request.postDataJSON();
      } catch {
        body = request.postData();
      }

      this.trackedCalls.push({
        type: 'createLead',
        url: request.url(),
        method: request.method(),
        body,
        timestamp: new Date()
      });

      if (config.shouldFail) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              errorCode: 'MOCK_ERROR',
              message: config.errorMessage ?? 'Mock create lead failure'
            }
          ])
        });
        return;
      }

      // Simulate duplicate detection
      if (config.simulateDuplicate) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          headers: {
            'sforce-duplicate-rule-header': 'true'
          },
          body: JSON.stringify([
            {
              errorCode: 'DUPLICATES_DETECTED',
              message: 'Use one of these records?',
              duplicateResult: {
                matchResults: [
                  {
                    matchRecords: [
                      {
                        record: {
                          Id:
                            config.duplicateLeadId ?? mockSalesforceData.leadId
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ])
        });
        return;
      }

      const leadId = this.generateMockLeadId();

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: leadId,
          success: true,
          errors: []
        })
      });
    });

    // Mock Lead update endpoint (PATCH)
    await page.route('**/services/data/*/sobjects/Lead/*', async (route) => {
      const request = route.request();

      if (request.method() !== 'PATCH') {
        // Handle GET and DELETE separately
        if (request.method() === 'GET') {
          return this.handleGetLead(route);
        }
        if (request.method() === 'DELETE') {
          return this.handleDeleteLead(route);
        }
        await route.continue();
        return;
      }

      let body: unknown;
      try {
        body = request.postDataJSON();
      } catch {
        body = request.postData();
      }

      this.trackedCalls.push({
        type: 'updateLead',
        url: request.url(),
        method: request.method(),
        body,
        timestamp: new Date()
      });

      if (config.shouldFail) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              errorCode: 'MOCK_ERROR',
              message: config.errorMessage ?? 'Mock update lead failure'
            }
          ])
        });
        return;
      }

      // PATCH returns 204 No Content on success
      await route.fulfill({
        status: 204
      });
    });
  }

  /**
   * Handle GET /sobjects/Lead/:id
   */
  private async handleGetLead(
    route: Parameters<Parameters<Page['route']>[1]>[0]
  ): Promise<void> {
    const request = route.request();
    const url = request.url();
    const leadIdMatch = url.match(/\/Lead\/([^/?]+)/);
    const leadId = leadIdMatch?.[1] ?? mockSalesforceData.leadId;

    this.trackedCalls.push({
      type: 'getLead',
      url,
      method: request.method(),
      timestamp: new Date()
    });

    if (this.config.shouldFail) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            errorCode: 'NOT_FOUND',
            message: this.config.errorMessage ?? 'Lead not found'
          }
        ])
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(this.buildMockLead(leadId))
    });
  }

  /**
   * Handle DELETE /sobjects/Lead/:id
   */
  private async handleDeleteLead(
    route: Parameters<Parameters<Page['route']>[1]>[0]
  ): Promise<void> {
    const request = route.request();

    this.trackedCalls.push({
      type: 'deleteLead',
      url: request.url(),
      method: request.method(),
      timestamp: new Date()
    });

    if (this.config.shouldFail) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            errorCode: 'MOCK_ERROR',
            message: this.config.errorMessage ?? 'Mock delete lead failure'
          }
        ])
      });
      return;
    }

    // DELETE returns 204 No Content on success
    await route.fulfill({
      status: 204
    });
  }

  /**
   * Assert that a lead was created with expected data
   */
  assertLeadCreated(
    expectedData?: Partial<{ Phone: string; State: string; FirstName: string }>
  ): void {
    const createCalls = this.getCallsByType('createLead');

    if (createCalls.length === 0) {
      throw new Error('No lead create API call was intercepted');
    }

    if (expectedData) {
      const lastCall = createCalls[createCalls.length - 1];
      const body = lastCall.body as Record<string, unknown>;

      for (const [key, expected] of Object.entries(expectedData)) {
        if (body?.[key] !== expected) {
          throw new Error(
            `Expected lead ${key} to be "${expected}" but got "${body?.[key]}"`
          );
        }
      }
    }
  }

  /**
   * Assert that a lead was updated
   */
  assertLeadUpdated(leadId?: string): void {
    const updateCalls = this.getCallsByType('updateLead');

    if (updateCalls.length === 0) {
      throw new Error('No lead update API call was intercepted');
    }

    if (leadId) {
      const hasMatchingCall = updateCalls.some((call) =>
        call.url.includes(leadId)
      );
      if (!hasMatchingCall) {
        throw new Error(`No update call found for lead ID "${leadId}"`);
      }
    }
  }

  /**
   * Assert no Salesforce API calls were made
   */
  assertNoCalls(): void {
    if (this.trackedCalls.length > 0) {
      const types = [...new Set(this.trackedCalls.map((c) => c.type))];
      throw new Error(
        `Expected no Salesforce API calls but found ${this.trackedCalls.length} call(s): ${types.join(', ')}`
      );
    }
  }
}

/**
 * Create Salesforce mock fixture
 */
export function createSalesforceMockFixture() {
  return base.extend<{ salesforceMock: SalesforceMockHelper }>({
    salesforceMock: async ({ page }, use) => {
      const helper = new SalesforceMockHelper(page);
      await use(helper);
    }
  });
}

/**
 * Default Salesforce mock fixture
 */
export const salesforceMockTest = createSalesforceMockFixture();
