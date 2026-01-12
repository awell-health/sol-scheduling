import { test, cleanupTestLead } from '../fixtures';
import { expect } from '@playwright/test';

/**
 * Example Checkly browser check demonstrating Salesforce fixture usage
 * 
 * These tests show how to:
 * - Fetch leads from Salesforce
 * - Query leads by phone number
 * - Create and delete test leads
 * - Combine Salesforce checks with browser interactions
 */

test.describe('Salesforce Integration', () => {
  test('can authenticate with Salesforce', async ({ salesforce }) => {
    // The fixture automatically authenticates on setup
    // This test verifies the token was obtained successfully
    const token = await salesforce.getToken();
    
    expect(token.accessToken).toBeDefined();
    expect(token.accessToken.length).toBeGreaterThan(0);
    expect(token.instanceUrl).toContain('salesforce.com');
  });

  test('can fetch a lead by ID', async ({ salesforce }) => {
    // Replace with a known test lead ID in your Salesforce instance
    const testLeadId = process.env.TEST_SALESFORCE_LEAD_ID;
    
    if (!testLeadId) {
      test.skip();
      return;
    }

    const lead = await salesforce.getLead(testLeadId);
    
    expect(lead.Id).toBe(testLeadId);
    expect(lead).toHaveProperty('Phone');
    expect(lead).toHaveProperty('Status');
  });

  test('can query leads by phone', async ({ salesforce }) => {
    // Replace with a known test phone number
    const testPhone = process.env.TEST_PHONE_NUMBER;
    
    if (!testPhone) {
      test.skip();
      return;
    }

    const lead = await salesforce.findLeadByPhone(testPhone);
    
    // Lead may or may not exist depending on test data
    if (lead) {
      expect(lead.Phone).toBe(testPhone);
    }
  });

  test('can create and delete a test lead', async ({ salesforce }) => {
    // Create a test lead with a unique phone number
    const testPhone = `+1555${Date.now().toString().slice(-7)}`;
    
    const createResult = await salesforce.createLead({
      Phone: testPhone,
      FirstName: 'Test',
      LastName: 'Lead',
      LeadSource: 'Checkly Test',
    });
    
    expect(createResult.success).toBe(true);
    expect(createResult.id).toBeDefined();
    
    // Verify the lead was created
    const lead = await salesforce.getLead(createResult.id);
    expect(lead.Phone).toBe(testPhone);
    expect(lead.FirstName).toBe('Test');
    
    // Clean up
    await cleanupTestLead(salesforce, createResult.id);
    
    // Verify deletion
    try {
      await salesforce.getLead(createResult.id);
      // If we get here, the lead wasn't deleted
      expect(true).toBe(false);
    } catch (error) {
      // Expected - lead should be deleted
      expect(String(error)).toContain('404');
    }
  });
});
