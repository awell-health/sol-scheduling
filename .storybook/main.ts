import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-interactions',
    '@storybook/addon-viewport'
    // '@chromatic-com/storybook'
  ],
  staticDirs: ['../public']
};
export default config;
