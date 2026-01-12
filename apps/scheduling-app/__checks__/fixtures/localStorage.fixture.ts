import { test as base, expect, Page } from '@playwright/test';

/**
 * Storage key used by the SOL onboarding flow
 */
export const STORAGE_KEYS = {
  ONBOARDING: 'sol.onboarding',
} as const;

/**
 * Shape of the onboarding data stored in localStorage
 */
export interface OnboardingStorageData {
  state?: string;
  service?: string;
  phone?: string;
  insurance?: string;
  consent?: boolean;
  updatedAt?: string;
  [key: string]: unknown;
}

/**
 * Local storage helper for Playwright/Checkly tests
 * Provides methods to read, write, and assert localStorage values
 */
export class LocalStorageHelper {
  constructor(private page: Page) {}

  /**
   * Get all localStorage data as an object
   */
  async getAll(): Promise<Record<string, unknown>> {
    return await this.page.evaluate(() => {
      const data: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            data[key] = JSON.parse(localStorage.getItem(key) ?? '');
          } catch {
            data[key] = localStorage.getItem(key);
          }
        }
      }
      return data;
    });
  }

  /**
   * Get a specific localStorage item by key
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    return await this.page.evaluate((k) => {
      const value = localStorage.getItem(k);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }, key);
  }

  /**
   * Get the raw string value from localStorage (no JSON parsing)
   */
  async getRaw(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Set a localStorage item
   */
  async set(key: string, value: unknown): Promise<void> {
    await this.page.evaluate(
      ({ k, v }) => {
        localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      },
      { k: key, v: value }
    );
  }

  /**
   * Remove a localStorage item
   */
  async remove(key: string): Promise<void> {
    await this.page.evaluate((k) => localStorage.removeItem(k), key);
  }

  /**
   * Clear all localStorage
   */
  async clear(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Check if a localStorage key exists
   */
  async has(key: string): Promise<boolean> {
    return await this.page.evaluate((k) => localStorage.getItem(k) !== null, key);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SOL Onboarding-specific methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get the SOL onboarding data from localStorage
   */
  async getOnboardingData(): Promise<OnboardingStorageData | null> {
    return await this.get<OnboardingStorageData>(STORAGE_KEYS.ONBOARDING);
  }

  /**
   * Set SOL onboarding data in localStorage
   */
  async setOnboardingData(data: OnboardingStorageData): Promise<void> {
    await this.set(STORAGE_KEYS.ONBOARDING, data);
  }

  /**
   * Clear SOL onboarding data from localStorage
   */
  async clearOnboardingData(): Promise<void> {
    await this.remove(STORAGE_KEYS.ONBOARDING);
  }

  /**
   * Get a specific onboarding preference value
   */
  async getOnboardingPreference<K extends keyof OnboardingStorageData>(
    key: K
  ): Promise<OnboardingStorageData[K] | undefined> {
    const data = await this.getOnboardingData();
    return data?.[key];
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Assertion helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that a localStorage key exists
   */
  async expectKeyExists(key: string): Promise<void> {
    const exists = await this.has(key);
    expect(exists, `Expected localStorage key "${key}" to exist`).toBe(true);
  }

  /**
   * Assert that a localStorage key does not exist
   */
  async expectKeyNotExists(key: string): Promise<void> {
    const exists = await this.has(key);
    expect(exists, `Expected localStorage key "${key}" to not exist`).toBe(false);
  }

  /**
   * Assert that a localStorage value equals expected value
   */
  async expectValue<T = unknown>(key: string, expected: T): Promise<void> {
    const actual = await this.get<T>(key);
    expect(actual as unknown).toEqual(expected);
  }

  /**
   * Assert that a localStorage value contains expected properties
   */
  async expectContains(key: string, expected: Record<string, unknown>): Promise<void> {
    const actual = await this.get<Record<string, unknown>>(key);
    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  }

  /**
   * Assert that the onboarding data contains expected values
   */
  async expectOnboardingContains(expected: Partial<OnboardingStorageData>): Promise<void> {
    await this.expectContains(STORAGE_KEYS.ONBOARDING, expected);
  }

  /**
   * Assert that a specific onboarding preference has expected value
   */
  async expectOnboardingPreference<K extends keyof OnboardingStorageData>(
    key: K,
    expected: OnboardingStorageData[K]
  ): Promise<void> {
    const actual = await this.getOnboardingPreference(key);
    expect(actual as unknown).toEqual(expected);
  }

  /**
   * Assert that onboarding data exists
   */
  async expectOnboardingExists(): Promise<void> {
    await this.expectKeyExists(STORAGE_KEYS.ONBOARDING);
  }

  /**
   * Assert that onboarding data does not exist
   */
  async expectOnboardingNotExists(): Promise<void> {
    await this.expectKeyNotExists(STORAGE_KEYS.ONBOARDING);
  }
}

/**
 * Create a localStorage fixture for Playwright/Checkly tests
 */
export function createLocalStorageFixture() {
  return base.extend<{ localStorage: LocalStorageHelper }>({
    localStorage: async ({ page }, use) => {
      const helper = new LocalStorageHelper(page);
      await use(helper);
    },
  });
}

/**
 * Default localStorage test fixture
 * 
 * @example
 * ```ts
 * import { localStorageTest } from './fixtures/localStorage.fixture';
 * 
 * localStorageTest('stores onboarding preferences', async ({ page, localStorage }) => {
 *   await page.goto('/providers');
 *   // ... interact with the page ...
 *   
 *   // Assert localStorage was updated
 *   await localStorage.expectOnboardingContains({
 *     state: 'NY',
 *     service: 'medication',
 *   });
 * });
 * ```
 */
export const localStorageTest = createLocalStorageFixture();

export type { LocalStorageHelper as LocalStorageHelperType };
