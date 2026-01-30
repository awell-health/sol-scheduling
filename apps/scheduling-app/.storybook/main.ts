import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs')
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs-vite'),
    options: {}
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  },
  // Configure Vite
  viteFinal: async (config) => {
    // Stub out server-only modules that shouldn't be loaded in Storybook
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Stub server-only packages
        '@awell-health/awell-sdk': path.resolve(
          __dirname,
          'mocks/awell-sdk-stub.ts'
        ),
        'workflow/api': path.resolve(__dirname, 'mocks/workflow-stub.ts'),
        workflow: path.resolve(__dirname, 'mocks/workflow-stub.ts'),
        'posthog-node': path.resolve(__dirname, 'mocks/posthog-node-stub.ts')
      };
    }

    return config;
  }
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
