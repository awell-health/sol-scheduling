// Scheduler package config built on top of base
import base from './base.mjs';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  ...base,
  // Scheduler package specific ignores and overrides
  {
    ignores: [
      // Ignore this JS utility script
      'update-classnames.js',
      // Ignore CommonJS scripts in this package (docs and utilities)
      '**/*.cjs'
    ]
  },
  {
    files: ['.storybook/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs'
    },
    rules: {
      // Allow require() in CommonJS scripts
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Using TypeScript, disable prop-types in this package
      'react/prop-types': 'off'
    }
  }
];

export default config;


