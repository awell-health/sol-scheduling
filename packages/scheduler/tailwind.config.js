/* eslint-disable */
/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

const secondaryBtn = ({ addComponents }) => {
  addComponents({
    '.btn-secondary': {
      padding: '.5rem 1rem',
      borderRadius: '.375rem',
      fontWeight: '600',
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'background-color .3s, color .3s',
      border: '1px solid #A45128',
      color: '#A45128',
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: '#f9e2da'
      }
    }
  });
};

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  prefix: 'sol-',
  safelist: [],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    extend: {
      borderWidth: {
        1: '1px'
      }
    }
  },
  plugins: [require('daisyui'), require('tailwindcss-animate'), secondaryBtn],
  daisyui: {
    themes: [
      {
        sol: {
          primary: '#517C7D',
          'primary-focus': 'rgba(81, 124, 125, 0.9)',
          'primary-content': colors.slate[50],

          secondary: '#D3E2E4',
          'secondary-focus': 'rgba(211, 226, 228, 0.9)',
          'secondary-content': colors.slate[600],

          '--rounded-box': '1rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '.25s',
          '--animation-input': '.2s',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px'
        }
      }
    ]
  }
};
