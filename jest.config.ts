import nextJest from 'next/jest.js'

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [],
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
    TextEncoder: require('util').TextEncoder,
    TextDecoder: require('util').TextDecoder,
  },
  modulePathIgnorePatterns: ['<rootDir>/src/__tests__'],
}

const createJestConfig = nextJest({
  dir: './',
})(config)

module.exports = async () => {
  // Create Next.js jest configuration presets
  const jestConfig = await createJestConfig()

  const moduleNameMapper = {
    ...jestConfig.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
  }

  return { ...jestConfig, moduleNameMapper }
}
