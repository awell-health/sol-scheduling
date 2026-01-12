import { test, expect } from '../fixtures';

/**
 * Example Checkly browser check demonstrating localStorage fixture usage
 * 
 * These tests show how to:
 * - Read and write localStorage values
 * - Assert on onboarding preferences
 * - Pre-populate localStorage before navigating
 */

const BASE_URL = process.env.ENVIRONMENT_URL ?? 'https://sol-scheduling.vercel.app';

test.describe('Local Storage Integration', () => {
  test('can read localStorage after page interaction', async ({ page, localStorage }) => {
    // Navigate to the providers page
    await page.goto(`${BASE_URL}/providers`);
    
    // Wait for the page to load and potentially set localStorage
    await page.waitForLoadState('networkidle');
    
    // Check if onboarding data was created
    const hasOnboarding = await localStorage.has('sol.onboarding');
    
    // Log what's in localStorage for debugging
    const allData = await localStorage.getAll();
    console.log('localStorage contents:', allData);
    
    // This is informational - actual assertion depends on your app behavior
    expect(typeof hasOnboarding).toBe('boolean');
  });

  test('can pre-populate localStorage before navigation', async ({ page, localStorage }) => {
    // Navigate to any page first to set up localStorage context
    await page.goto(`${BASE_URL}/providers`);
    
    // Set up test data in localStorage
    await localStorage.setOnboardingData({
      state: 'NY',
      service: 'medication',
      phone: '+12125551234',
      insurance: 'Blue Cross Blue Shield',
      consent: true,
      updatedAt: new Date().toISOString(),
    });
    
    // Verify it was set
    await localStorage.expectOnboardingExists();
    await localStorage.expectOnboardingContains({
      state: 'NY',
      service: 'medication',
    });
    
    // Reload the page to see if app respects the pre-populated data
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Data should persist after reload
    await localStorage.expectOnboardingContains({
      state: 'NY',
      service: 'medication',
    });
  });

  test('can assert individual onboarding preferences', async ({ page, localStorage }) => {
    await page.goto(`${BASE_URL}/providers`);
    
    // Set test data
    await localStorage.setOnboardingData({
      state: 'CA',
      consent: false,
    });
    
    // Assert individual fields
    await localStorage.expectOnboardingPreference('state', 'CA');
    await localStorage.expectOnboardingPreference('consent', false);
    
    // Get specific preference value
    const state = await localStorage.getOnboardingPreference('state');
    expect(state).toBe('CA');
  });

  test('can clear localStorage and verify', async ({ page, localStorage }) => {
    await page.goto(`${BASE_URL}/providers`);
    
    // Set some data
    await localStorage.setOnboardingData({
      state: 'TX',
    });
    
    await localStorage.expectOnboardingExists();
    
    // Clear it
    await localStorage.clearOnboardingData();
    
    // Verify it's gone
    await localStorage.expectOnboardingNotExists();
  });

  test('can work with arbitrary localStorage keys', async ({ page, localStorage }) => {
    await page.goto(`${BASE_URL}/providers`);
    
    // Set arbitrary data
    await localStorage.set('my-custom-key', { foo: 'bar', count: 42 });
    
    // Read it back
    const data = await localStorage.get<{ foo: string; count: number }>('my-custom-key');
    expect(data?.foo).toBe('bar');
    expect(data?.count).toBe(42);
    
    // Use assertion helpers
    await localStorage.expectKeyExists('my-custom-key');
    await localStorage.expectContains('my-custom-key', { foo: 'bar' });
    
    // Clean up
    await localStorage.remove('my-custom-key');
    await localStorage.expectKeyNotExists('my-custom-key');
  });
});
