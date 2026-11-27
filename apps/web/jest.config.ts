import nextJest from 'next/jest.js'
import { config } from 'dotenv'
import { TextEncoder, TextDecoder } from 'node:util'

process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1'

config({ path: '.env.testing' })

/** @type {import('jest').Config} */
const jestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [],
  },
  transformIgnorePatterns: ['!node_modules/(?!@src/*.)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/tests/**',
    '!src/**/__mocks__/**',
  ],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
    TextEncoder,
    TextDecoder,
  },
}

const TEST_FILES = '*.test.{ts,tsx}'

// Widgets are the hooks and views under src/ui; handlers are the actions, controllers and
// other non-UI tests (the complement of the other two, so a new test is never skipped);
// app holds the page, layout and route tests co-located under src/app.
const projects = [
  {
    displayName: 'widgets',
    testMatch: [`<rootDir>/src/ui/**/${TEST_FILES}`],
  },
  {
    displayName: 'handlers',
    testMatch: [`<rootDir>/src/**/${TEST_FILES}`],
    testPathIgnorePatterns: ['<rootDir>/src/ui/', '<rootDir>/src/app/'],
  },
  {
    displayName: 'app',
    testMatch: [`<rootDir>/src/app/**/${TEST_FILES}`],
    testPathIgnorePatterns: ['<rootDir>/src/app/tests/'],
  },
]

async function createProjectConfig(project: (typeof projects)[number]) {
  const createJestConfig = nextJest({
    dir: './src',
  })({ ...jestConfig, ...project })

  // Create Next.js jest configuration presets
  const finalJestConfig = await createJestConfig()

  const moduleNameMapper = {
    ...finalJestConfig.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@stardust/core/([^/]+)/([^/]+)/fakers$':
      '<rootDir>/../../packages/core/src/$1/domain/$2/fakers/index.ts',
  }

  return { ...finalJestConfig, moduleNameMapper }
}

export default async () => ({
  projects: await Promise.all(projects.map(createProjectConfig)),
  collectCoverageFrom: jestConfig.collectCoverageFrom,
  // LCOV paths are relative to the repository root, as the changed-lines gate expects.
  coverageReporters: ['json-summary', 'text-summary', ['lcov', { projectRoot: '../..' }]],
  maxWorkers: 1,
})
