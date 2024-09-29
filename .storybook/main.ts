import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname } from 'path';

const config: StorybookConfig = {
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {}
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-controls'),
    getAbsolutePath('@storybook/addon-actions'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('storybook-addon-mock-date')
  ],
  staticDirs: ['../public']
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
