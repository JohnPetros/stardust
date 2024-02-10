import { breakpoints } from './src/styles/breakpoints'
import { colors } from './src/styles/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/global/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        default: 'var(--font-poppins)',
        code: 'var(--font-roboto-mono)',
      },

      colors: colors,

      screens: breakpoints,
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
