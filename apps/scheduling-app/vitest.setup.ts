import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// Set dummy environment variables for tests that may instantiate clients
// These are overridden by mocks but provide fallback if mock fails
process.env.SALESFORCE_SUBDOMAIN = 'test';
process.env.SALESFORCE_CLIENT_ID = 'test-client-id';
process.env.SALESFORCE_CLIENT_SECRET = 'test-client-secret';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});
