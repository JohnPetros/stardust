import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  clearMocks: true,

  coverageProvider: 'v8',

  testMatch: ['**/tests/**/*.test.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
    '^.+\\.m?[jc]s$': [
      'babel-jest',
      {
        presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }]],
      },
    ],
  },

  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs', 'json'],

  extensionsToTreatAsEsm: ['.ts'],

  transformIgnorePatterns: ['node_modules/(?!((@mastra|tokenx|ai|@ai-sdk)/))'],

  setupFiles: ['<rootDir>/jest.setup.js'],
}

export default config
