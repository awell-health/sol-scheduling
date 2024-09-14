import type { Preview } from '@storybook/react';
import '../styles/globals.css';
import '@awell-health/ui-library/dist/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
