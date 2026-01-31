import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW worker for browser environment (Storybook, dev server)
 * 
 * This worker intercepts network requests in the browser.
 * Useful for Storybook stories that need mock API responses.
 * 
 * @example
 * ```ts
 * // In Storybook preview.ts
 * import { worker } from '@/mocks/browser';
 * 
 * // Start the worker before stories load
 * worker.start({ onUnhandledRequest: 'bypass' });
 * ```
 */
export const worker = setupWorker(...handlers);
