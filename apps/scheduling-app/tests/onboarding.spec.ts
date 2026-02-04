import { test, expect } from '../__checks__/fixtures';

/**
 * Onboarding Flow E2E Tests
 *
 * These tests run against the REAL Salesforce sandbox.
 * Leads created during tests are automatically cleaned up.
 *
 * ## Running
 *
 * ```bash
 * cd apps/scheduling-app
 * pnpm test:e2e
 * ```
 *
 * Requires Salesforce credentials in .env.local:
 * - SALESFORCE_SUBDOMAIN
 * - SALESFORCE_CLIENT_ID
 * - SALESFORCE_CLIENT_SECRET
 */
test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ apiMock }) => {
    // Mock SOL API (providers, availability) - these are browser-side
    await apiMock.setupMocks();
  });

  test('displays state selection on first visit', async ({
    page,
    localStorage
  }) => {
    await page.goto('/providers');

    await expect(
      page.getByRole('heading', { name: /state are you located/i })
    ).toBeVisible();
    await expect(page.getByLabel('Select your state')).toBeVisible();
    await localStorage.expectOnboardingNotExists();
  });

  test('saves state selection to localStorage', async ({
    page,
    localStorage
  }) => {
    await page.goto('/providers');

    await page.getByLabel('Select your state').click();
    await page.getByRole('option', { name: 'Colorado' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await localStorage.expectOnboardingContains({ state: 'CO' });
  });

  test('progresses through service selection', async ({
    page,
    localStorage
  }) => {
    await page.goto('/providers');

    // State
    await page.getByLabel('Select your state').click();
    await page.getByRole('option', { name: 'Colorado' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Service
    await expect(
      page.getByRole('radio', { name: /medication/i })
    ).toBeVisible();
    await page.getByRole('radio', { name: /medication/i }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await localStorage.expectOnboardingContains({
      state: 'CO',
      service: 'Psychiatric'
    });
  });

  test('shows phone input after service selection', async ({ page }) => {
    await page.goto('/providers');

    // State
    await page.getByLabel('Select your state').click();
    await page.getByRole('option', { name: 'Colorado' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Service
    await page.getByRole('radio', { name: /medication/i }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Phone step
    await expect(
      page.getByRole('heading', { name: /phone number/i })
    ).toBeVisible();
    await expect(page.locator('[data-slot="phone-input"]')).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeVisible();
  });

  test('phone step enables continue after consent', async ({ page }) => {
    await page.goto('/providers');

    // State
    await page.getByLabel('Select your state').click();
    await page.getByRole('option', { name: 'Colorado' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Service
    await page.getByRole('radio', { name: /medication/i }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Phone - verify consent checkbox enables button
    await page.locator('[data-slot="phone-input"]').fill('3035551234');

    // Button should be disabled without consent
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();

    // Check consent
    await page.getByRole('checkbox').check();

    // Button should be enabled
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  });

  test('skips onboarding when localStorage preferences exist', async ({
    page,
    localStorage
  }) => {
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
    await page.goto('/providers');

    // Should skip onboarding
    await expect(page.getByLabel('Select your state')).not.toBeVisible({
      timeout: 5000
    });
    await expect(page).toHaveURL(/\/providers/);
  });

  test('can navigate back through steps', async ({ page }) => {
    await page.goto('/providers');

    // Go to service step
    await page.getByLabel('Select your state').click();
    await page.getByRole('option', { name: 'Colorado' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(
      page.getByRole('radio', { name: /medication/i })
    ).toBeVisible();

    // Go back
    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByLabel('Select your state')).toBeVisible();
  });
});
