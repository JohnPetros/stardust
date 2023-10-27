import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

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
}

export default createJestConfig(config)
