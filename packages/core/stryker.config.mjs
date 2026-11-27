/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'jest',
  plugins: ['@stryker-mutator/jest-runner'],
  jest: {
    configFile: 'jest.config.ts',
    enableFindRelatedTests: true,
    // Stryker runs a copy of this workspace, so the tests must be found in that copy.
    config: { rootDir: '.' },
  },
  coverageAnalysis: 'perTest',
  ignorePatterns: ['build/**', 'coverage/**', 'reports/**'],
  // A sandbox left behind holds copies of the tests, which Jest would then run too.
  cleanTempDir: 'always',

  mutate: ['src/*/use-cases/*.ts', '!src/*/use-cases/index.ts'],

  reporters: ['clear-text', 'progress', 'html', 'json'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  jsonReporter: { fileName: 'reports/mutation/mutation.json' },
}
