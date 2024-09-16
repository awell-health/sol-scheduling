import { expect, describe, it } from '@jest/globals';

import { getMockProvidersResponse } from './providers.mock';

describe('mocks', () => {
  describe('getMockProvidersResponse', () => {
    it('should not throw an error', () => {
      expect(() => getMockProvidersResponse()).not.toThrow();
    });

    it('should return data successfully', () => {
      const res = getMockProvidersResponse();

      expect(res).toBeDefined(); // Ensure that data is defined
      expect(Array.isArray(res.data)).toBe(true); // Check that the returned value is an array
      expect(res.data.length).toBeGreaterThan(0); // Ensure the array is not empty
    });
  });
});
