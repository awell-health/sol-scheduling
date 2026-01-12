import config from '@repo/eslint-config/next';

export default [
  ...config,
  {
    files: ['**/*.spec.ts', '**/__checks__/**/*.ts'],
    rules: {
      'no-empty-pattern': 'off',
    },
  },
];

