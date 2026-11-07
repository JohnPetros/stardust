/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        default: 'var(--font-poppins)',
        code: 'var(--font-roboto-mono)',
      },

      colors: {
        green: {
          900: '#07303B',
          800: '#027558',
          700: '#20925D',
          600: '#38C76D',
          500: '#0FE983',
          400: '#00FF88',
          300: '#4affab',
          200: '#adffd9',
          100: '#dafff0',
        },
        yellow: {
          900: '#1c1400',
          700: '#674F00',
          500: '#B08C18',
          400: '#FFCE31',
        },
        gray: {
          950: '#0b0e0f',
          900: '#141A1B',
          800: '#1E2626',
          700: '#303030',
          600: '#595959',
          500: '#868686',
          400: '#AFB6C2',
          300: '#d3d7e1',
          200: '#EBEBEB',
          100: '#f2f2f2',
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
        // Tokens `Semantic/Dark` do Penpot, definidos em global.css sob
        // `:root[data-theme='stardust-dark']`.
        theme: {
          background: 'var(--theme-background)',
          canvas: 'var(--theme-canvas)',
          surface: 'var(--theme-surface)',
          border: 'var(--theme-border)',
          'border-quiet': 'var(--theme-border-quiet)',
          'text-primary': 'var(--theme-text-primary)',
          'text-secondary': 'var(--theme-text-secondary)',
          action: 'var(--theme-action)',
          'accent-text': 'var(--theme-accent-text)',
          success: 'var(--theme-success)',
          reward: 'var(--theme-reward)',
          danger: 'var(--theme-danger)',
          'tag-background': 'var(--theme-tag-background)',
          'tag-foreground': 'var(--theme-tag-foreground)',
          selection: 'var(--theme-selection)',
          'selection-surface': 'var(--theme-selection-surface)',
          'success-surface': 'var(--theme-success-surface)',
          'danger-surface': 'var(--theme-danger-surface)',
        },
      },
      // Geometria (`Geometry` do Penpot): raio, altura, padding, gap e borda de controle.
      borderRadius: {
        theme: 'var(--theme-radius-default)',
        'theme-full': 'var(--theme-radius-full)',
      },
      height: {
        'theme-control': 'var(--theme-control-height)',
      },
      spacing: {
        'theme-control-x': 'var(--theme-control-padding-x)',
        'theme-control-gap': 'var(--theme-control-icon-gap)',
      },
      borderWidth: {
        'theme-control': 'var(--theme-control-border)',
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
  plugins: [require('@tailwindcss/typography')],
}
