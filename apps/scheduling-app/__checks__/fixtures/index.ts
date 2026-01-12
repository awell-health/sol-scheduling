import { test as base } from '@playwright/test';
import { SalesforceTestClient, createSalesforceFixture, cleanupTestLead } from './salesforce.fixture';
import { LocalStorageHelper, createLocalStorageFixture, STORAGE_KEYS, type OnboardingStorageData } from './localStorage.fixture';

export {
  // Salesforce fixture exports
  SalesforceTestClient,
  createSalesforceFixture,
  cleanupTestLead,
  // Local storage fixture exports
  LocalStorageHelper,
  createLocalStorageFixture,
  STORAGE_KEYS,
  type OnboardingStorageData,
};

export type { SalesforceLeadData, SalesforceToken, SalesforceConfig } from './salesforce.fixture';

/**
 * Combined test fixture with both Salesforce and localStorage helpers
 * 
 * @example
 * ```ts
 * import { test, expect } from '../fixtures';
 * 
 * test('onboarding creates lead and stores preferences', async ({ 
 *   page, 
 *   salesforce, 
 *   localStorage 
 * }) => {
 *   await page.goto('/providers');
 *   
 *   // Complete onboarding flow...
 *   await page.fill('[data-testid="phone-input"]', '+12125551234');
 *   await page.click('[data-testid="submit"]');
 *   
 *   // Assert localStorage was updated
 *   await localStorage.expectOnboardingContains({
 *     phone: '+12125551234',
 *   });
 *   
 *   // Fetch the lead from Salesforce and verify
 *   const lead = await salesforce.findLeadByPhone('+12125551234');
 *   expect(lead).not.toBeNull();
 *   expect(lead?.Phone).toBe('+12125551234');
 *   
 *   // Cleanup
 *   if (lead) {
 *     await cleanupTestLead(salesforce, lead.Id);
 *   }
 * });
 * ```
 */
export const test = base.extend<{
  salesforce: SalesforceTestClient;
  localStorage: LocalStorageHelper;
}>({
  salesforce: async ({}, use) => {
    const config = {
      subdomain: process.env.SALESFORCE_SUBDOMAIN ?? '',
      clientId: process.env.SALESFORCE_CLIENT_ID ?? '',
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET ?? '',
      apiVersion: process.env.SALESFORCE_API_VERSION ?? 'v61.0',
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

  localStorage: async ({ page }, use) => {
    const helper = new LocalStorageHelper(page);
    await use(helper);
  },
});
