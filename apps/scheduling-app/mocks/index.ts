/**
 * MSW mock infrastructure
 * 
 * This module provides mock API handlers for testing and development.
 * 
 * @example
 * ```ts
 * // For Vitest tests (Node.js)
 * import { server } from '@/mocks/server';
 * 
 * // For Storybook (browser)
 * import { worker } from '@/mocks/browser';
 * 
 * // For custom handlers
 * import { handlers, createErrorHandler } from '@/mocks/handlers';
 * 
 * // For fixture data
 * import { mockProviders, mockAvailability } from '@/mocks/fixtures';
 * ```
 */

export * from './handlers';
export * from './fixtures';
