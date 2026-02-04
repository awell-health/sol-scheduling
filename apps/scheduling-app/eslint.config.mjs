// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import config from '@repo/eslint-config/next';

export default [...config, {
  files: ['**/*.spec.ts', '**/__checks__/**/*.ts', '**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*.ts'],
  rules: {
    'no-empty-pattern': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
}, {
  files: ['**/*.stories.tsx'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
  },
}, ...storybook.configs["flat/recommended"]];

