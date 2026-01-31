/**
 * Stub for @awell-health/awell-sdk in Storybook
 *
 * The Awell SDK is a server-only package that requires Node.js APIs.
 * This stub provides empty exports to satisfy imports in Storybook
 * without actually loading the real package.
 */

export type Environment = 'production' | 'sandbox' | 'development';

export class AwellSdk {
  constructor(_config: { apiKey: string; environment: Environment }) {
    // Stub constructor
  }

  orchestration = {
    mutation: async () => ({ startCareFlow: { id: 'stub' } }),
    query: async () => ({})
  };

  hostedPages = {
    mutation: async () => ({
      startHostedActivitySession: { session_id: 'stub' }
    })
  };
}

export default { AwellSdk };
