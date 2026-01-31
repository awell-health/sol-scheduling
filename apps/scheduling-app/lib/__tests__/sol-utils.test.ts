import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Sample test file demonstrating the Vitest setup.
 * 
 * This file tests the basic test infrastructure is working correctly.
 * Real tests for sol-utils will be added in Phase 1.
 */

describe('Test Infrastructure', () => {
  it('should have vitest working correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to vitest globals', () => {
    expect(vi).toBeDefined();
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
  });

  it('should support async tests', async () => {
    const result = await Promise.resolve('hello');
    expect(result).toBe('hello');
  });
});

describe('Mock Fixtures', () => {
  it('should be able to import mock providers', async () => {
    const { mockProviders } = await import('../../mocks/fixtures');
    expect(mockProviders).toBeDefined();
    expect(mockProviders.length).toBeGreaterThan(0);
    expect(mockProviders[0].id).toBeDefined();
  });

  it('should have providers with expected structure', async () => {
    const { mockProviders } = await import('../../mocks/fixtures');
    const provider = mockProviders[0];
    
    expect(provider).toHaveProperty('id');
    expect(provider).toHaveProperty('firstName');
    expect(provider).toHaveProperty('lastName');
    expect(provider).toHaveProperty('location');
  });
});
