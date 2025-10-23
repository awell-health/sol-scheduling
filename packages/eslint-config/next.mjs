// Next.js flavored config built on top of base
import base from './base.mjs';
import nextPlugin from '@next/eslint-plugin-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
const nextRules = (nextPlugin.configs?.['core-web-vitals']?.rules) || (nextPlugin.configs?.recommended?.rules) || {};

const config = [
  ...base,
  {
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextRules,
      // Ensure React in JSX scope rule stays off
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    files: ['**/next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  }
];

export default config;


