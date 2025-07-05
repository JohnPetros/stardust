const path = require('node:path')
const root = path.resolve(__dirname, '..', 'core')

/** @type {import('jest').Config} */
module.exports = {
  rootDir: root,
  testEnvironment: 'node',
  displayName: 'core-tests',
  verbose: true,
  transformIgnorePatterns: ['node_modules'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
}
