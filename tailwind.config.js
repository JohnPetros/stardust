import { breakpoints } from './src/modules/global/constants/breakpoints'
import { colors } from './src/modules/global/constants/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/infra/**/*.{js,ts,jsx,tsx,mdx}',
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
