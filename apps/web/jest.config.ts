import nextJest from 'next/jest.js'

/** @type {import('jest').Config} */
const config = {
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
  dir: './',
})(config)

module.exports = async () => {
  // Create Next.js jest configuration presets
  const jestConfig = await createJestConfig()

  const moduleNameMapper = {
    ...jestConfig.moduleNameMapper,
    uuid: require.resolve('uuid'),
    '^@/(.*)$': '<rootDir>/src/$1',
  }

  return { ...jestConfig, moduleNameMapper }
}
