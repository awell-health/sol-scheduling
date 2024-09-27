import { GetProvidersInputType } from '../schema';
import { mockProvidersResponse } from './providers.mock';
import { mockProviderAvailabilityResponse } from './providerAvailability.mock';
import { mockProviderResponse } from './provider.mock';

const mockFetchProvidersFn = (_prefs: GetProvidersInputType) => {
  console.log('mock filter by', _prefs);
  return Promise.resolve(mockProvidersResponse);
};

export {
  mockFetchProvidersFn,
  mockProviderAvailabilityResponse,
  mockProvidersResponse,
  mockProviderResponse
};
