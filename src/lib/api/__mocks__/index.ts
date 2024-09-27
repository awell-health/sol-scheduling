import { GetProvidersInputType } from '../schema';
import { mockProvidersResponse } from './GetProviders.mock';
import { mockProviderAvailabilityResponse } from './GetProviderAvailability.mock';
import { mockProviderResponse } from './GetProvider.mock';

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
