import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',

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
  },

  moduleFileExtensions: ['ts', 'js', 'json'],

  extensionsToTreatAsEsm: ['.ts'],

  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],

  setupFiles: ['<rootDir>/jest.setup.js'],
}

export default config
