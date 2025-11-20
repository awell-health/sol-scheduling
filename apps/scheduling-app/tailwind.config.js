/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#517C7D',
          foreground: '#F7F9F9'
        },
        secondary: {
          DEFAULT: '#D3E2E4',
          foreground: '#415457'
        },
        accent: {
          DEFAULT: '#A45128',
          foreground: '#FFFFFF'
        },
        slate: {
          25: '#F7F9F9',
          50: '#EFF3F3',
          100: '#E0E8E9',
          200: '#CBD6D8',
          300: '#AFBFC2',
          400: '#8B9CA0',
          500: '#6A7A7F',
          600: '#4D5C60',
          700: '#394547',
          800: '#262E30',
          900: '#121516'
        }
      },
      borderRadius: {
        xl: '1rem'
      },
      boxShadow: {
        card: '0 8px 24px rgba(18, 21, 22, 0.08)'
      }
    }
  }
};

export default config;