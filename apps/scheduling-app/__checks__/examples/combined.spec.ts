import { test, expect, cleanupTestLead } from '../fixtures';

/**
 * Example Checkly browser check demonstrating combined fixtures
 * 
 * These tests show how to use both Salesforce and localStorage fixtures
 * together to test end-to-end onboarding flows.
 */

const BASE_URL = process.env.ENVIRONMENT_URL ?? 'https://sol-scheduling.vercel.app';

test.describe('End-to-End Onboarding Flow', () => {
  test('onboarding flow creates lead and stores preferences', async ({
    page,
    salesforce,
    localStorage,
  }) => {
    // Generate a unique phone for this test run
    const testPhone = `+1555${Date.now().toString().slice(-7)}`;
    const formattedPhone = testPhone.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '($2) $3-$4');
    
    // Navigate to the providers page
    await page.goto(`${BASE_URL}/providers`);
    await page.waitForLoadState('networkidle');
    
    // Pre-populate localStorage with test state (simulating a partially completed flow)
    await localStorage.setOnboardingData({
      state: 'NY',
      service: 'medication',
    });
    
    // Verify localStorage was set
    await localStorage.expectOnboardingContains({
      state: 'NY',
      service: 'medication',
    });
    
    // After the full onboarding flow completes (phone entry, etc.),
    // you would verify the lead was created in Salesforce
    
    // Example: Check if a lead with this phone exists
    // (In a real test, this would be after completing the actual onboarding UI)
    const existingLead = await salesforce.findLeadByPhone(formattedPhone);
    
    if (existingLead) {
      // Clean up any existing test lead
      await cleanupTestLead(salesforce, existingLead.Id);
    }
  });

  test('can verify Salesforce lead matches localStorage preferences', async ({
    page,
    salesforce,
    localStorage,
  }) => {
    // This test demonstrates verifying consistency between localStorage and Salesforce
    
    // First, get a known test lead ID from env
    const testLeadId = process.env.TEST_SALESFORCE_LEAD_ID;
    
    if (!testLeadId) {
      test.skip();
      return;
    }
    
    // Fetch the lead from Salesforce
    const lead = await salesforce.getLead(testLeadId);
    
    // Navigate to the app
    await page.goto(`${BASE_URL}/providers`);
    await page.waitForLoadState('networkidle');
    
    // Set localStorage to match what the lead should have
    const onboardingData = {
      state: lead.State ?? undefined,
      insurance: lead.Insurance_Company_Name__c ?? undefined,
      consent: lead.Contact_Consent__c ?? undefined,
    };
    
    await localStorage.setOnboardingData(onboardingData);
    
    // Verify the data roundtrips correctly
    if (lead.State) {
      await localStorage.expectOnboardingPreference('state', lead.State);
    }
    
    if (lead.Insurance_Company_Name__c) {
      await localStorage.expectOnboardingPreference('insurance', lead.Insurance_Company_Name__c);
    }
  });

  test('complete booking flow stores lead ID in localStorage', async ({
    page,
    salesforce,
    localStorage,
  }) => {
    // This is a template for testing the complete booking flow
    // Customize based on your actual UI and data-testid attributes
    
    await page.goto(`${BASE_URL}/providers`);
    await page.waitForLoadState('networkidle');
    
    // Log initial localStorage state
    const initialData = await localStorage.getAll();
    console.log('Initial localStorage:', initialData);
    
    // After completing booking flow, the app should store the lead ID
    // You can then fetch that lead from Salesforce to verify it was created correctly
    
    const onboardingData = await localStorage.getOnboardingData();
    console.log('Onboarding data:', onboardingData);
    
    // Example: If your app stores the lead ID somewhere, you can fetch and verify
    // const leadId = await localStorage.get<string>('sol.leadId');
    // if (leadId) {
    //   const lead = await salesforce.getLead(leadId);
    //   expect(lead).not.toBeNull();
    // }
  });
});
