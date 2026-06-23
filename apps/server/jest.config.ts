import type { Config } from 'jest'

const sharedConfig: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: 'v8',

  // Route tests share Supabase-backed fixtures and become flaky under heavy parallelism.
  maxWorkers: 1,
  testTimeout: 15000,

  testMatch: ['**/tests/**/*.test.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@stardust/core/([^/]+)/([^/]+)/fakers$':
      '<rootDir>/../../packages/core/src/$1/domain/$2/fakers/index.ts',
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
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
        ],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['node_modules/(?!((@mastra|tokenx|ai|@ai-sdk)/))'],
  setupFiles: ['<rootDir>/jest.setup.js'],
}

const config: Config = {
  projects: [
    {
      ...sharedConfig,
      displayName: 'server',
      testMatch: ['**/tests/**/*.test.ts'],
      testPathIgnorePatterns: ['<rootDir>/src/app/hono/routers/'],
    },
    {
      ...sharedConfig,
      displayName: 'server-integration',
      testMatch: ['<rootDir>/src/app/hono/routers/**/tests/**/*.test.ts'],
      maxWorkers: 1,
      testTimeout: 30000,
    },
  ],
}

export default config
