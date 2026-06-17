import nextJest from 'next/jest.js'
import { config } from 'dotenv'
import { TextEncoder, TextDecoder } from 'node:util'

process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1'

config({ path: '.env.testing' })

/** @type {import('jest').Config} */
const jestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/src/app/tests/'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [],
  },
  transformIgnorePatterns: ['!node_modules/(?!@src/*.)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
    TextEncoder,
    TextDecoder,
  },
}

const createJestConfig = nextJest({
  dir: './src',
})(jestConfig)

export default async () => {
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
