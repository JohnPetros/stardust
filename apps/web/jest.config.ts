import nextJest from 'next/jest.js'
import { config } from 'dotenv'

config({ path: '.env.test' })

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
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
    TextEncoder: require('node:util').TextEncoder,

    TextDecoder: require('node:util').TextDecoder,
  },
}

const createJestConfig = nextJest({
  dir: './src',
})(jestConfig)

module.exports = async () => {
  // Create Next.js jest configuration presets
  const finalJestConfig = await createJestConfig()

  const moduleNameMapper = {
    ...finalJestConfig.moduleNameMapper,
    uuid: require.resolve('uuid'),
    '^@/(.*)$': '<rootDir>/src/$1',
  }

  return { ...finalJestConfig, moduleNameMapper }
}
