import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server for Node.js environment (Vitest)
 * 
 * This server intercepts network requests during tests.
 * Setup and teardown is handled in vitest.setup.ts.
 * 
 * @example
 * ```ts
 * // In a test file, override handlers for specific scenarios
 * import { server } from '@/mocks/server';
 * import { createErrorHandler } from '@/mocks/handlers';
 * 
 * test('handles API error gracefully', async () => {
 *   server.use(
 *     createErrorHandler('/api/v2/provider', 500, 'Internal Server Error')
 *   );
 *   
 *   // ... test code that should handle the error
 * });
 * ```
 */
export const server = setupServer(...handlers);
