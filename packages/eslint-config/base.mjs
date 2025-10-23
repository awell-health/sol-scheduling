// Shared ESLint 9 flat config (base)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/storybook-static/**',
      '**/docs/dist/**',
      '**/docs/**/dist/**',
      'packages/scheduler/docs/**',
      // Legacy ignore patterns
      'packages/scheduler/vite.config.js',
      'packages/scheduler/**/*.js'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: true
      }
    },
    plugins: {
      react
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.ts', '.tsx'] }
      ],
      'react/prop-types': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      // React Hooks rules temporarily disabled until ESLint 9 compatible plugin is available
    }
  },
  // Overrides
  {
    files: ['**/*.stories.ts', '**/*.stories.tsx', '**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      // Ensure TS-specific rules that require type info don't run on JS
      parserOptions: {
        project: null
      }
    }
  }
];

export default config;


