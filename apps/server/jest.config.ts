import type { Config } from 'jest'

const isCoverageRun = process.argv.includes('--coverage')

const sharedConfig: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'cjs', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm/|(@mastra|@sindresorhus|escape-string-regexp|p-map|@workflow|tokenx|ai|@ai-sdk)/))',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/tests/**',
    '!src/**/fakers/**',
  ],
}

const config: Config = {
  coverageProvider: 'v8',
  clearMocks: true,
  maxWorkers: isCoverageRun ? '50%' : 1,
  testTimeout: 30000,
  projects: [
    {
      ...sharedConfig,
      displayName: 'unit',
      testMatch: ['**/tests/**/*.test.ts'],
      testPathIgnorePatterns: [
        '<rootDir>/src/tests/hono/',
        '<rootDir>/src/tests/inngest/',
      ],
    },
    {
      ...sharedConfig,
      displayName: 'hono',
      testMatch: ['<rootDir>/src/tests/hono/routes/**/*.test.ts'],
    },
    {
      ...sharedConfig,
      displayName: 'inngest',
      testMatch: ['<rootDir>/src/tests/inngest/functions/**/*.test.ts'],
    },
  ],
}

export default config
