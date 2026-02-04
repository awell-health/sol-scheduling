import { test as base } from '@playwright/test';
import { SalesforceTestClient } from './salesforce.fixture';
import { mockSalesforceData } from '../../mocks/fixtures';

/**
 * Test lead data structure
 */
export interface TestLeadData {
  /** Salesforce lead ID (real or mock) */
  id: string;
  /** Phone number in E.164 format */
  phone: string;
  /** Whether this is a real Salesforce lead */
  isReal: boolean;
}

/**
 * Strategy for test lead management
 */
export type LeadStrategy = 'mock' | 'real';

/**
 * Options for creating a test lead
 */
export interface CreateTestLeadOptions {
  /** Override phone number (default: generated unique number) */
  phone?: string;
  /** First name (default: 'E2E') */
  firstName?: string;
  /** Last name (default: 'TestUser') */
  lastName?: string;
  /** State code (default: 'CO') */
  state?: string;
  /** Additional lead fields */
  extraFields?: Record<string, unknown>;
}

/**
 * Test lead manager that handles both mock and real Salesforce leads.
 *
 * Mock mode (default):
 * - Returns synthetic lead IDs
 * - No Salesforce API calls
 * - No cleanup needed
 *
 * Real mode (for integration tests):
 * - Creates actual leads in Salesforce sandbox
 * - Tracks created leads for automatic cleanup
 * - Cleans up all leads in afterEach
 *
 * @example Mock mode (default):
 * ```ts
 * test('booking flow', async ({ testLead, page, apiMock }) => {
 *   const lead = testLead.createMockLead();
 *   // lead.id is a synthetic ID, no Salesforce call made
 *   // Use apiMock to intercept any Salesforce-related API calls
 * });
 * ```
 *
 * @example Real mode (integration tests):
 * ```ts
 * test('booking creates real lead', async ({ testLead }) => {
 *   const lead = await testLead.createRealLead({ state: 'NY' });
 *   // lead.id is a real Salesforce lead ID
 *   // Automatically cleaned up after test
 * });
 * ```
 */
export class TestLeadManager {
  private createdLeads: TestLeadData[] = [];
  private salesforce: SalesforceTestClient | null = null;
  private mockLeadCounter = 0;

  constructor(salesforce?: SalesforceTestClient) {
    this.salesforce = salesforce ?? null;
  }

  /**
   * Generate a unique phone number for testing.
   * Format: +1555XXXXXXX (555 prefix is reserved for fictitious numbers)
   */
  generateTestPhone(): string {
    const timestamp = Date.now().toString().slice(-7);
    return `+1555${timestamp}`;
  }

  /**
   * Create a mock lead (no Salesforce API call).
   * Returns a synthetic lead ID that can be used with API mocks.
   */
  createMockLead(options: CreateTestLeadOptions = {}): TestLeadData {
    this.mockLeadCounter++;
    const phone = options.phone ?? this.generateTestPhone();

    const lead: TestLeadData = {
      id: `00Q_MOCK_${Date.now()}_${this.mockLeadCounter}`,
      phone,
      isReal: false
    };

    this.createdLeads.push(lead);
    return lead;
  }

  /**
   * Get the default mock lead from fixtures.
   * Useful when you want consistent test data.
   */
  getDefaultMockLead(): TestLeadData {
    return {
      id: mockSalesforceData.leadId,
      phone: mockSalesforceData.lead.Phone,
      isReal: false
    };
  }

  /**
   * Create a real lead in Salesforce sandbox.
   * Requires Salesforce credentials to be configured.
   * Lead will be automatically cleaned up after the test.
   */
  async createRealLead(
    options: CreateTestLeadOptions = {}
  ): Promise<TestLeadData> {
    if (!this.salesforce) {
      throw new Error(
        'Cannot create real lead: Salesforce client not configured. ' +
          'Ensure SALESFORCE_* environment variables are set.'
      );
    }

    const phone = options.phone ?? this.generateTestPhone();

    const result = await this.salesforce.createLead({
      Phone: phone,
      FirstName: options.firstName ?? 'E2E',
      LastName: options.lastName ?? 'TestUser',
      State: options.state ?? 'CO',
      LeadSource: 'E2E Test',
      ...options.extraFields
    });

    if (!result.success) {
      throw new Error(
        `Failed to create Salesforce lead: ${JSON.stringify(result)}`
      );
    }

    const lead: TestLeadData = {
      id: result.id,
      phone,
      isReal: true
    };

    this.createdLeads.push(lead);
    return lead;
  }

  /**
   * Get all leads created during this test
   */
  getCreatedLeads(): TestLeadData[] {
    return [...this.createdLeads];
  }

  /**
   * Get only real leads (for cleanup)
   */
  getRealLeads(): TestLeadData[] {
    return this.createdLeads.filter((lead) => lead.isReal);
  }

  /**
   * Clean up all real leads created during the test.
   * Called automatically in fixture teardown.
   */
  async cleanup(): Promise<{ cleaned: number; errors: string[] }> {
    const realLeads = this.getRealLeads();
    const errors: string[] = [];
    let cleaned = 0;

    if (realLeads.length === 0 || !this.salesforce) {
      return { cleaned: 0, errors: [] };
    }

    for (const lead of realLeads) {
      try {
        await this.salesforce.deleteLead(lead.id);
        cleaned++;
      } catch (error) {
        // Log but don't fail - lead might already be deleted or converted
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to delete lead ${lead.id}: ${message}`);
        console.warn(`[TestLeadManager] Cleanup warning:`, message);
      }
    }

    // Clear the list
    this.createdLeads = [];

    return { cleaned, errors };
  }

  /**
   * Register an externally created lead for cleanup.
   * Use this when a lead is created through the application flow
   * rather than directly through the test fixture.
   */
  registerForCleanup(leadId: string, phone?: string): void {
    this.createdLeads.push({
      id: leadId,
      phone: phone ?? 'unknown',
      isReal: true
    });
  }
}

/**
 * Create test lead fixture with optional Salesforce integration.
 *
 * The fixture automatically handles cleanup of real leads after each test.
 *
 * Environment variables:
 * - USE_REAL_SALESFORCE=true - Enable real Salesforce lead creation
 * - SALESFORCE_SUBDOMAIN, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET - Required for real mode
 */
export function createTestLeadFixture() {
  return base.extend<{ testLead: TestLeadManager }>({
    testLead: async ({}, use, testInfo) => {
      // Check if real Salesforce mode is enabled
      const useRealSalesforce = process.env.USE_REAL_SALESFORCE === 'true';

      let salesforce: SalesforceTestClient | undefined;

      if (useRealSalesforce) {
        const config = {
          subdomain: process.env.SALESFORCE_SUBDOMAIN ?? '',
          clientId: process.env.SALESFORCE_CLIENT_ID ?? '',
          clientSecret: process.env.SALESFORCE_CLIENT_SECRET ?? '',
          apiVersion: process.env.SALESFORCE_API_VERSION ?? 'v61.0'
        };

        if (config.subdomain && config.clientId && config.clientSecret) {
          salesforce = new SalesforceTestClient(config);
          await salesforce.getToken();
        } else {
          console.warn(
            '[TestLeadFixture] USE_REAL_SALESFORCE=true but credentials missing. Using mock mode.'
          );
        }
      }

      const manager = new TestLeadManager(salesforce);

      // Run the test
      await use(manager);

      // Cleanup after test
      const { cleaned, errors } = await manager.cleanup();

      if (cleaned > 0) {
        console.log(`[TestLeadFixture] Cleaned up ${cleaned} test lead(s)`);
      }

      if (errors.length > 0) {
        // Attach cleanup errors to test report (don't fail the test)
        testInfo.annotations.push({
          type: 'cleanup-warnings',
          description: errors.join('; ')
        });
      }
    }
  });
}

/**
 * Default test lead fixture
 */
export const testLeadTest = createTestLeadFixture();
