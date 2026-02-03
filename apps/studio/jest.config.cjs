/** @type {import('jest').Config} */
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    // More specific patterns must come first
    '^@/constants$': '<rootDir>/src/constants/__mocks__/index.ts',
    '^@/constants/env$': '<rootDir>/src/constants/__mocks__/env.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    // Core package mappings based on package.json exports
    '^@stardust/core/reporting/entities$':
      '<rootDir>/../../packages/core/src/reporting/domain/entities/index.ts',
    '^@stardust/core/reporting/entities/dtos$':
      '<rootDir>/../../packages/core/src/reporting/domain/entities/dtos/index.ts',
    '^@stardust/core/reporting/entities/fakers$':
      '<rootDir>/../../packages/core/src/reporting/domain/entities/fakers/index.ts',
    '^@stardust/core/reporting/structures$':
      '<rootDir>/../../packages/core/src/reporting/domain/structures/index.ts',
    '^@stardust/core/reporting/structures/dtos$':
      '<rootDir>/../../packages/core/src/reporting/domain/structures/dtos/index.ts',
    '^@stardust/core/reporting/structures/fakers$':
      '<rootDir>/../../packages/core/src/reporting/domain/structures/fakers/index.ts',
    '^@stardust/core/reporting/events$':
      '<rootDir>/../../packages/core/src/reporting/domain/events/index.ts',
    '^@stardust/core/reporting/types$':
      '<rootDir>/../../packages/core/src/reporting/domain/types/index.ts',
    '^@stardust/core/reporting/interfaces$':
      '<rootDir>/../../packages/core/src/reporting/interfaces/index.ts',
    '^@stardust/core/reporting/use-cases$':
      '<rootDir>/../../packages/core/src/reporting/use-cases/index.ts',
    '^@stardust/core/global/entities$':
      '<rootDir>/../../packages/core/src/global/domain/entities/index.ts',
    '^@stardust/core/global/entities/dtos$':
      '<rootDir>/../../packages/core/src/global/domain/entities/dtos/index.ts',
    '^@stardust/core/global/aggregates$':
      '<rootDir>/../../packages/core/src/global/domain/aggregates/index.ts',
    '^@stardust/core/global/structures$':
      '<rootDir>/../../packages/core/src/global/domain/structures/index.ts',
    '^@stardust/core/global/structures/dtos$':
      '<rootDir>/../../packages/core/src/global/domain/structures/dtos/index.ts',
    '^@stardust/core/global/structures/fakers$':
      '<rootDir>/../../packages/core/src/global/domain/structures/fakers/index.ts',
    '^@stardust/core/global/interfaces$':
      '<rootDir>/../../packages/core/src/global/interfaces/index.ts',
    '^@stardust/core/global/types$':
      '<rootDir>/../../packages/core/src/global/domain/types/index.ts',
    '^@stardust/core/global/dtos$':
      '<rootDir>/../../packages/core/src/global/dtos/index.ts',
    '^@stardust/core/global/responses$':
      '<rootDir>/../../packages/core/src/global/responses/index.ts',
    '^@stardust/core/global/constants$':
      '<rootDir>/../../packages/core/src/global/constants/index.ts',
    '^@stardust/core/global/libs$':
      '<rootDir>/../../packages/core/src/global/libs/index.ts',
    '^@stardust/core/global/abstracts$':
      '<rootDir>/../../packages/core/src/global/domain/abstracts/index.ts',
    '^@stardust/core/global/errors$':
      '<rootDir>/../../packages/core/src/global/domain/errors/index.ts',
    '^@stardust/core/profile/entities$':
      '<rootDir>/../../packages/core/src/profile/domain/entities/index.ts',
    '^@stardust/core/profile/entities/fakers$':
      '<rootDir>/../../packages/core/src/profile/domain/entities/fakers/index.ts',
    '^@stardust/core/profile/structures$':
      '<rootDir>/../../packages/core/src/profile/domain/structures/index.ts',
    '^@stardust/core/profile/interfaces$':
      '<rootDir>/../../packages/core/src/profile/interfaces/index.ts',
    '^@stardust/core/challenging/entities$':
      '<rootDir>/../../packages/core/src/challenging/domain/entities/index.ts',
    '^@stardust/core/challenging/entities/fakers$':
      '<rootDir>/../../packages/core/src/challenging/domain/entities/fakers/index.ts',
    '^@stardust/core/challenging/structures$':
      '<rootDir>/../../packages/core/src/challenging/domain/structures/index.ts',
    '^@stardust/core/challenging/interfaces$':
      '<rootDir>/../../packages/core/src/challenging/interfaces/index.ts',
    '^@stardust/core/ranking/entities$':
      '<rootDir>/../../packages/core/src/ranking/domain/entities/index.ts',
    '^@stardust/core/ranking/structures$':
      '<rootDir>/../../packages/core/src/ranking/domain/structures/index.ts',
    '^@stardust/core/ranking/interfaces$':
      '<rootDir>/../../packages/core/src/ranking/interfaces/index.ts',
    '^@stardust/core/shop/entities$':
      '<rootDir>/../../packages/core/src/shop/domain/entities/index.ts',
    '^@stardust/core/shop/entities/fakers$':
      '<rootDir>/../../packages/core/src/shop/domain/entities/fakers/index.ts',
    '^@stardust/core/shop/structures$':
      '<rootDir>/../../packages/core/src/shop/domain/structures/index.ts',
    '^@stardust/core/shop/interfaces$':
      '<rootDir>/../../packages/core/src/shop/interfaces/index.ts',
    '^@stardust/core/lesson/entities$':
      '<rootDir>/../../packages/core/src/lesson/domain/entities/index.ts',
    '^@stardust/core/lesson/entities/fakers$':
      '<rootDir>/../../packages/core/src/lesson/domain/entities/fakers/index.ts',
    '^@stardust/core/lesson/structures$':
      '<rootDir>/../../packages/core/src/lesson/domain/structures/index.ts',
    '^@stardust/core/lesson/interfaces$':
      '<rootDir>/../../packages/core/src/lesson/interfaces/index.ts',
    '^@stardust/core/space/entities$':
      '<rootDir>/../../packages/core/src/space/domain/entities/index.ts',
    '^@stardust/core/space/structures$':
      '<rootDir>/../../packages/core/src/space/domain/structures/index.ts',
    '^@stardust/core/space/interfaces$':
      '<rootDir>/../../packages/core/src/space/interfaces/index.ts',
    '^@stardust/core/auth/entities$':
      '<rootDir>/../../packages/core/src/auth/domain/entities/index.ts',
    '^@stardust/core/auth/structures$':
      '<rootDir>/../../packages/core/src/auth/domain/structures/index.ts',
    '^@stardust/core/auth/interfaces$':
      '<rootDir>/../../packages/core/src/auth/interfaces/index.ts',
    '^@stardust/core/storage/structures$':
      '<rootDir>/../../packages/core/src/storage/domain/structures/index.ts',
    '^@stardust/core/storage/interfaces$':
      '<rootDir>/../../packages/core/src/storage/interfaces/index.ts',
    '^@stardust/core/conversation/entities$':
      '<rootDir>/../../packages/core/src/conversation/domain/entities/index.ts',
    '^@stardust/core/conversation/interfaces$':
      '<rootDir>/../../packages/core/src/conversation/interfaces/index.ts',
    '^@stardust/core/forum/entities$':
      '<rootDir>/../../packages/core/src/forum/domain/entities/index.ts',
    '^@stardust/core/forum/interfaces$':
      '<rootDir>/../../packages/core/src/forum/interfaces/index.ts',
    '^@stardust/core/manual/entities$':
      '<rootDir>/../../packages/core/src/manual/domain/entities/index.ts',
    '^@stardust/core/manual/interfaces$':
      '<rootDir>/../../packages/core/src/manual/interfaces/index.ts',
    '^@stardust/core/main$': '<rootDir>/../../packages/core/src/main.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(@stardust|@testing-library)/)'],
}
