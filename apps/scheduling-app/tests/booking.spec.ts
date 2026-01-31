import { test, expect } from '../__checks__/fixtures';

/**
 * Booking Flow E2E Tests
 *
 * These tests verify the booking UI flow.
 * Full booking creates real data in Salesforce sandbox.
 */
test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page, apiMock, localStorage }) => {
    await apiMock.setupMocks();

    // Pre-seed onboarding to skip it
    const completePreferences = {
      state: 'CO',
      service: 'Psychiatric',
      phone: '3035551234',
      insurance: 'Blue Cross Blue Shield',
      consent: true,
      updatedAt: new Date().toISOString()
    };

    await page.goto('/');
    await localStorage.setOnboardingData(completePreferences);
  });

  test('shows providers page after onboarding', async ({ page }) => {
    await page.goto('/providers');

    // Should be on providers page (not redirected to onboarding)
    await expect(page).toHaveURL(/\/providers/);
    await expect(page.getByLabel('Select your state')).not.toBeVisible({
      timeout: 3000
    });
  });

  test.skip('displays provider detail page', async ({ page }) => {
    // TODO: Provider detail page needs real provider IDs from API
    await page.goto('/providers/provider-psychiatry-1');
    await expect(page.getByText('Sarah Johnson')).toBeVisible({
      timeout: 10000
    });
  });
});
