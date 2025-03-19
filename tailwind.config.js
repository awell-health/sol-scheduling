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
        // awell: {
        //   primary: 'rgb(164, 81, 40)',
        //   'primary-focus': 'rgba(164, 81, 40, 0.9)',
        //   'primary-content': colors.white,

        // secondary: '#f9e2da',
        // 'secondary-focus': 'rgba(239, 155, 140, 0.9)',
        // 'secondary-content': colors.slate[600],

        //   accent: colors.blue[50],
        //   'accent-focus': colors.blue[100],
        //   'accent-content': colors.blue[600],

        //   neutral: colors.slate[700],
        //   'neutral-focus': colors.slate[800],
        //   'neutral-content': colors.white,

        //   success: colors.green[600],
        //   'success-content': colors.white,

        //   info: colors.blue[600],
        //   'info-content': colors.white,

        //   warning: colors.orange[600],
        //   'warning-content': colors.white,

        //   error: colors.red[600],
        //   'error-content': colors.white,

        //   'base-100': colors.white,
        //   'base-200': colors.slate[100],
        //   'base-300': colors.slate[300],
        //   'base-content': colors.slate[600],

        // },
        sol: {
          primary: '#A45128',
          'primary-focus': 'rgba(164, 81, 40, 0.9)',
          'primary-content': colors.slate[50],

          secondary: '#f9e2da',
          'secondary-focus': 'rgba(239, 155, 140, 0.9)',
          'secondary-content': colors.slate[600],

          // select: {
          //   color: '#1e293b',
          //   borderColor: '#1e293b',
          //   borderRadius: '0.375rem' // rounded-md
          // },

          '--rounded-box': '1rem',
          // '--rounded-btn': '.5rem',
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
