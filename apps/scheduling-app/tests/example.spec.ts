import { test, expect, mockOnboardingData } from '../__checks__/fixtures';

/**
 * Example E2E tests demonstrating the test fixture patterns.
 * 
 * These tests serve as templates for the actual E2E tests to be written.
 * They showcase:
 * - localStorage pre-seeding for skipping onboarding
 * - API mocking for controlled test scenarios
 * - Common assertion patterns
 */

test.describe('Provider List Page', () => {
  test.beforeEach(async ({ page, apiMock }) => {
    // Set up API mocks before each test
    await apiMock.setupMocks();
  });

  test('displays providers when onboarding is complete', async ({ page, localStorage }) => {
    // Pre-seed localStorage to skip onboarding
    await page.goto('/');
    await localStorage.setOnboardingData(mockOnboardingData.complete);
    
    // Navigate to providers page
    await page.goto('/providers');
    
    // Verify providers are displayed
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Michael Chen')).toBeVisible();
  });

  test('shows empty state when no providers match filters', async ({ page, localStorage, apiMock }) => {
    // Configure API to return empty providers
    apiMock.configure({ emptyProviders: true });
    
    // Pre-seed localStorage
    await page.goto('/');
    await localStorage.setOnboardingData(mockOnboardingData.complete);
    
    await page.goto('/providers');
    
    // Verify empty state message (adjust selector based on actual UI)
    await expect(page.getByText(/no providers/i)).toBeVisible();
  });
});

test.describe('Provider Detail Page', () => {
  test.beforeEach(async ({ page, apiMock, localStorage }) => {
    // Set up API mocks
    await apiMock.setupMocks();
    
    // Pre-seed localStorage to skip onboarding
    await page.goto('/');
    await localStorage.setOnboardingData(mockOnboardingData.complete);
  });

  test('displays provider information', async ({ page }) => {
    await page.goto('/providers/provider-psychiatry-1');
    
    // Verify provider details are displayed
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText(/board-certified psychiatrist/i)).toBeVisible();
  });

  test('shows availability slots', async ({ page }) => {
    await page.goto('/providers/provider-psychiatry-1');
    
    // Verify availability is shown (adjust based on actual UI)
    await expect(page.getByRole('button', { name: /select/i }).first()).toBeVisible();
  });

  test('handles no availability gracefully', async ({ page, apiMock }) => {
    // Configure no availability
    apiMock.configure({ noAvailability: true });
    
    await page.goto('/providers/provider-psychiatry-1');
    
    // Verify no availability message (adjust based on actual UI)
    await expect(page.getByText(/no available/i)).toBeVisible();
  });
});
