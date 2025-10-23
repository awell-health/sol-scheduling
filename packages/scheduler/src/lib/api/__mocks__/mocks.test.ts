import { expect, describe, it } from '@jest/globals';

import { getMockProvidersResponse } from './GetProviders.mock';
import { getMockProviderResponse } from './GetProvider.mock';
import { mockProviderAvailabilityResponse } from './GetProviderAvailability.mock';

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

  describe('getMockProviderResponse', () => {
    it('should not throw an error', () => {
      expect(() => getMockProvidersResponse()).not.toThrow();
    });

    it('should return data successfully', () => {
      const res = getMockProviderResponse();
      expect(res.data).toBeDefined();
    });
  });

  describe('getProviders should suffice for all calls', () => {
    it('should suffice for GetProviders', () => {
      const res = getMockProvidersResponse();
      expect(res).toBeDefined();
    });

    it('should suffice for GetProvider', () => {
      const res = getMockProviderResponse();
      const res2 = getMockProvidersResponse();
      const providerOne = res.data;
      const providerTwo = res2.data.find((p) => p.id === providerOne.id);
      expect(providerTwo).toBeDefined();
       
      const { events, ...providerTwoMinusEvents } = providerTwo!;
      expect(providerOne).toStrictEqual(providerTwoMinusEvents);
    });

    it('should suffice for GetProviderAvailability', () => {
      const res = mockProviderAvailabilityResponse('1717');
      const events1717One = res.data['1717'];
      expect(events1717One).toBeDefined();
      const res2 = getMockProvidersResponse();
      const events1717Two = res2.data.find((p) => p.id === '1717')?.events;
      expect(events1717Two).toBeDefined();
      // we aren't worrying about the events being the same here... so long as they parse correctly, that's enough.
    });
  });
});
