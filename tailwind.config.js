/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        code: ['Roboto', 'sans-serif'],
      },

      colors: {
        green: {
          900: '#07303B',
          800: '#027558',
          700: '#20925D',
          500: '#0FE983',
          400: '#00FF88',
        },
        yellow: {
          700: '#674F00',
          500: '#B08C18',
          400: '#FFCE31',
        },
        gray: {
          900: '#141A1B',
          800: '#1E2626',
          500: '#868686',
          400: '#AFB6C2',
          100: '#EBEBEB',
        },
        blue: {
          700: '#022F43',
          300: '#00D1FF',
        },
        red: {
          700: '#FF3737',
          300: '#FF8484',
        },
        purple: {
          700: '#514869',
        },
      },

      screens: {
        xs: '440px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
}
