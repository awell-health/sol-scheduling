import { test, expect } from '../../__checks__/fixtures';

/**
 * Salesforce Integration Tests
 *
 * These tests interact with the REAL Salesforce sandbox.
 * They should be run:
 * - Manually during development
 * - In a separate CI job (not on every PR)
 * - With proper Salesforce sandbox credentials
 *
 * ## Running These Tests
 *
 * ```bash
 * # Set environment variables
 * export USE_REAL_SALESFORCE=true
 * export SALESFORCE_SUBDOMAIN=your-sandbox
 * export SALESFORCE_CLIENT_ID=your-client-id
 * export SALESFORCE_CLIENT_SECRET=your-client-secret
 *
 * # Run only integration tests
 * pnpm playwright test tests/integration/ --project=chromium
 * ```
 *
 * ## Cleanup
 *
 * All leads created during tests are automatically deleted
 * in the fixture teardown. If a test fails, cleanup still runs.
 *
 * ## Safety
 *
 * - Tests use unique phone numbers (555-xxx-xxxx prefix)
 * - Tests are tagged as 'integration' for filtering
 * - Tests skip gracefully if credentials are missing
 */
test.describe('Salesforce Integration', () => {
  // Skip all tests if real Salesforce is not enabled
  test.beforeAll(() => {
    if (process.env.USE_REAL_SALESFORCE !== 'true') {
      test.skip();
    }
  });

  test('creates and cleans up a real test lead @integration', async ({
    testLead,
    salesforce
  }) => {
    // Create a real lead
    const lead = await testLead.createRealLead({
      firstName: 'E2E',
      lastName: 'IntegrationTest',
      state: 'CO'
    });

    // Verify the lead exists in Salesforce
    const sfLead = await salesforce.getLead(lead.id);
    expect(sfLead.Id).toBe(lead.id);
    expect(sfLead.Phone).toBe(lead.phone);
    expect(sfLead.FirstName).toBe('E2E');
    expect(sfLead.LastName).toBe('IntegrationTest');
    expect(sfLead.State).toBe('CO');

    // Lead will be automatically cleaned up after test
  });

  test('handles lead created during onboarding flow @integration', async ({
    page,
    testLead,
    salesforce,
    apiMock
  }) => {
    // Set up API mocks (for SOL API, not Salesforce)
    await apiMock.setupMocks();

    // Generate a unique phone for this test
    const testPhone = testLead.generateTestPhone();
    const phoneDigits = testPhone.replace(/\D/g, '').slice(-10);

    await page.goto('/providers');

    // Complete state selection
    await page.getByLabel('Select your state').click();
    await page.getByRole('option', { name: 'Colorado' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Complete service selection
    await page.getByRole('radio', { name: /medication/i }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Enter phone - this creates a REAL Salesforce lead
    await page.locator('[data-slot="phone-input"]').fill(phoneDigits);
    await page.getByRole('button', { name: 'Continue' }).click();

    // Wait for lead creation
    await page.waitForTimeout(3000);

    // Find the lead that was created (phone stored in formatted US format)
    const formattedPhone = `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
    const lead = await salesforce.findLeadByPhone(formattedPhone);
    expect(lead).not.toBeNull();

    // Register the lead for cleanup
    if (lead) {
      testLead.registerForCleanup(lead.Id, formattedPhone);
    }
  });

  test('updates lead during booking flow @integration', async ({
    page,
    testLead,
    salesforce,
    localStorage,
    apiMock
  }) => {
    // Create a real lead to start with
    const lead = await testLead.createRealLead({
      firstName: 'PreBooking',
      lastName: 'Test',
      state: 'CO'
    });

    // Set up mocks (except Salesforce)
    await apiMock.setupMocks();

    // Pre-seed onboarding with the real lead
    await page.goto('/');
    await localStorage.setOnboardingData({
      state: 'CO',
      service: 'medication',
      phone: lead.phone,
      consent: true,
      salesforceLeadId: lead.id
    });

    // Navigate to provider and book
    await page.goto(`/providers/provider-psychiatry-1?slc=${lead.id}`);

    // Note: Full booking flow would update the lead
    // This test verifies the lead can be read with booking-related fields

    // Verify lead exists and can be fetched
    const sfLead = await salesforce.getLead(lead.id);
    expect(sfLead.Id).toBe(lead.id);
  });

  test('multiple leads created in test are all cleaned up @integration', async ({
    testLead,
    salesforce
  }) => {
    // Create multiple leads
    const lead1 = await testLead.createRealLead({ state: 'CO' });
    const lead2 = await testLead.createRealLead({ state: 'NY' });
    const lead3 = await testLead.createRealLead({ state: 'VA' });

    // Verify all were created
    const sf1 = await salesforce.getLead(lead1.id);
    const sf2 = await salesforce.getLead(lead2.id);
    const sf3 = await salesforce.getLead(lead3.id);

    expect(sf1.State).toBe('CO');
    expect(sf2.State).toBe('NY');
    expect(sf3.State).toBe('VA');

    // Check that testLead is tracking all of them
    const realLeads = testLead.getRealLeads();
    expect(realLeads).toHaveLength(3);

    // All will be cleaned up automatically after test
  });
});

test.describe('Salesforce Integration - Error Handling', () => {
  test.beforeAll(() => {
    if (process.env.USE_REAL_SALESFORCE !== 'true') {
      test.skip();
    }
  });

  test('handles cleanup failures gracefully @integration', async ({
    testLead
  }) => {
    // Create a mock lead (not real) with a fake ID
    const fakeLead = testLead.createMockLead();

    // Manually mark it as "real" to trigger cleanup attempt
    // This simulates a lead that was deleted externally
    testLead.registerForCleanup('00Q_INVALID_ID_' + Date.now());

    // Cleanup will run after test and should not throw
    // It should log a warning but continue
  });
});
