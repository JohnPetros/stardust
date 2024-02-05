module.exports = {
  env: {
    node: true,
  },
  root: true,
  plugins: ['simple-import-sort'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'prettier/prettier': ['warn', { usePrettierrc: true, endOfLine: 'auto' }],
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^\\u0000'],
          ['^react', '^@?\\w'],
          ['^(@prism)(/.*|$)'],
          ['^(@env)(/.*|$)'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
  },
}

// "plugins": ["prettier-plugin-tailwindcss"]
