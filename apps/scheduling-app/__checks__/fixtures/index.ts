import { test as base, expect } from '@playwright/test';
import {
  SalesforceTestClient,
  createSalesforceFixture,
  cleanupTestLead
} from './salesforce.fixture';
import {
  LocalStorageHelper,
  createLocalStorageFixture,
  STORAGE_KEYS,
  type OnboardingStorageData
} from './localStorage.fixture';
import {
  ApiMockHelper,
  createApiMockFixture,
  mockProviders,
  mockProviderDetails,
  mockAvailability,
  mockBookingResponse,
  mockOnboardingData,
  mockWorkflowProgress
} from './api.fixture';
import {
  TestLeadManager,
  createTestLeadFixture,
  type TestLeadData,
  type CreateTestLeadOptions
} from './testLead.fixture';
import {
  WorkflowMockHelper,
  createWorkflowMockFixture,
  type WorkflowMockConfig,
  type MockBookingResult
} from './workflow.fixture';
import {
  SalesforceMockHelper,
  createSalesforceMockFixture,
  type SalesforceMockConfig
} from './salesforceMock.fixture';

export {
  // Salesforce fixture exports (real client for integration tests)
  SalesforceTestClient,
  createSalesforceFixture,
  cleanupTestLead,
  // Local storage fixture exports
  LocalStorageHelper,
  createLocalStorageFixture,
  STORAGE_KEYS,
  type OnboardingStorageData,
  // API mock fixture exports
  ApiMockHelper,
  createApiMockFixture,
  // Test lead fixture exports (manages mock/real leads with cleanup)
  TestLeadManager,
  createTestLeadFixture,
  type TestLeadData,
  type CreateTestLeadOptions,
  // Workflow mock fixture exports (intercepts workflow API calls)
  WorkflowMockHelper,
  createWorkflowMockFixture,
  type WorkflowMockConfig,
  type MockBookingResult,
  // Salesforce mock fixture exports (intercepts Salesforce API calls)
  SalesforceMockHelper,
  createSalesforceMockFixture,
  type SalesforceMockConfig,
  // Mock data exports
  mockProviders,
  mockProviderDetails,
  mockAvailability,
  mockBookingResponse,
  mockOnboardingData,
  mockWorkflowProgress
};

export type {
  SalesforceLeadData,
  SalesforceToken,
  SalesforceConfig
} from './salesforce.fixture';
export type { ApiMockConfig } from './api.fixture';

/**
 * Combined test fixture with all E2E testing helpers.
 *
 * ## Available Fixtures
 *
 * ### For Fully Mocked Tests (recommended for CI):
 * - `apiMock` - Mock SOL API responses
 * - `salesforceMock` - Mock Salesforce API at network level
 * - `workflowMock` - Mock workflow API calls
 * - `testLead` - Generate mock lead IDs (no real Salesforce calls)
 * - `localStorage` - Read/write localStorage
 *
 * ### For Integration Tests (real Salesforce sandbox):
 * - `salesforce` - Real Salesforce client (requires credentials)
 * - `testLead` - Create real leads with automatic cleanup (set USE_REAL_SALESFORCE=true)
 *
 * ## Quick Start
 *
 * @example Fully mocked test (default, fast):
 * ```ts
 * import { test, expect } from '../fixtures';
 *
 * test('booking flow with mocked services', async ({
 *   page,
 *   apiMock,
 *   salesforceMock,
 *   workflowMock,
 *   testLead,
 *   localStorage,
 * }) => {
 *   // Create mock lead (no API call)
 *   const lead = testLead.createMockLead();
 *
 *   // Set up all mocks
 *   await apiMock.setupMocks();
 *   await salesforceMock.setupMocks();
 *   await workflowMock.setupMocks();
 *
 *   // Pre-seed onboarding data
 *   await page.goto('/');
 *   await localStorage.setOnboardingData({
 *     state: 'CO',
 *     service: 'medication',
 *     phone: lead.phone,
 *   });
 *
 *   // Navigate and test
 *   await page.goto('/providers/provider-psychiatry-1');
 *   await page.click('[data-testid="book-button"]');
 *
 *   // Assert workflow was triggered
 *   workflowMock.assertWorkflowStarted({ salesforceLeadId: lead.id });
 * });
 * ```
 *
 * @example Integration test with real Salesforce (run with USE_REAL_SALESFORCE=true):
 * ```ts
 * test('creates real lead in Salesforce', async ({
 *   page,
 *   testLead,
 *   salesforce,
 * }) => {
 *   // Create real lead (auto-cleaned up after test)
 *   const lead = await testLead.createRealLead({ state: 'NY' });
 *
 *   // Navigate with slc param
 *   await page.goto(`/providers?slc=${lead.id}`);
 *
 *   // Verify lead was fetched
 *   const sfLead = await salesforce.getLead(lead.id);
 *   expect(sfLead.State).toBe('NY');
 * });
 * ```
 */
export const test = base.extend<{
  salesforce: SalesforceTestClient;
  localStorage: LocalStorageHelper;
  apiMock: ApiMockHelper;
  testLead: TestLeadManager;
  workflowMock: WorkflowMockHelper;
  salesforceMock: SalesforceMockHelper;
}>({
  // Real Salesforce client (throws if credentials missing)
  salesforce: async ({}, use) => {
    const config = {
      subdomain: process.env.SALESFORCE_SUBDOMAIN ?? '',
      clientId: process.env.SALESFORCE_CLIENT_ID ?? '',
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET ?? '',
      apiVersion: process.env.SALESFORCE_API_VERSION ?? 'v61.0'
    };

    if (!config.subdomain || !config.clientId || !config.clientSecret) {
      throw new Error(
        'Salesforce config missing. Set SALESFORCE_SUBDOMAIN, SALESFORCE_CLIENT_ID, and SALESFORCE_CLIENT_SECRET environment variables in .env or .env.local'
      );
    }

    const client = new SalesforceTestClient(config);
    await client.getToken();
    await use(client);
  },

  // localStorage helper
  localStorage: async ({ page }, use) => {
    const helper = new LocalStorageHelper(page);
    await use(helper);
  },

  // SOL API mock helper
  apiMock: async ({ page }, use) => {
    const helper = new ApiMockHelper(page);
    await use(helper);
  },

  // Test lead manager (handles both mock and real leads)
  testLead: async ({}, use, testInfo) => {
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
      }
    }

    const manager = new TestLeadManager(salesforce);
    await use(manager);

    // Cleanup after test
    const { cleaned, errors } = await manager.cleanup();

    if (cleaned > 0) {
      console.log(`[TestLeadFixture] Cleaned up ${cleaned} test lead(s)`);
    }

    if (errors.length > 0) {
      testInfo.annotations.push({
        type: 'cleanup-warnings',
        description: errors.join('; ')
      });
    }
  },

  // Workflow mock helper
  workflowMock: async ({ page }, use) => {
    const helper = new WorkflowMockHelper(page);
    await use(helper);
  },

  // Salesforce API mock helper (network-level interception)
  salesforceMock: async ({ page }, use) => {
    const helper = new SalesforceMockHelper(page);
    await use(helper);
  }
});

// Re-export expect for convenience
export { expect };
