import type { Preview } from '@storybook/react';
import '../app/globals.css';

// Initialize MSW in browser for API mocking in stories
async function initMsw() {
  if (typeof window !== 'undefined') {
    const { worker } = await import('../mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
    });
  }
}

// Start MSW before stories load
initMsw();

const preview: Preview = {
  parameters: {
    // Actions are automatically detected for handlers starting with "on"
    actions: { argTypesRegex: '^on[A-Z].*' },
    // Control types for common prop types
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default layout is padded for better story visibility
    layout: 'padded',
    // Viewport presets for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
    },
    // Backgrounds matching the app's color scheme
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F7F9F9' },
        { name: 'dark', value: '#121516' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
  // Global decorators applied to all stories
  decorators: [],
  // Tags for filtering stories
  tags: ['autodocs'],
};

export default preview;
