import { mock, type Mock } from 'ts-jest-mocker'

import type { CacheProvider } from '#global/interfaces/index'
import { Datetime } from '#global/libs/index'
import { CodeExplanationLimitExceededError } from '../../domain/errors'
import { RegisterCodeExplanationUsageUseCase } from '../RegisterCodeExplanationUsageUseCase'

describe('Register Code Explanation Usage Use Case', () => {
  let cache: Mock<CacheProvider>
  let useCase: RegisterCodeExplanationUsageUseCase
  const userId = 'user-id'
  const cacheKey = `userId:${userId}:code-explanation-usage-count`
  const expiresAt = new Date('2024-01-01T23:59:59Z')

  beforeEach(() => {
    cache = mock<CacheProvider>()
    cache.get.mockImplementation()
    cache.set.mockImplementation()
    jest.spyOn(Datetime.prototype, 'getEndOfDay').mockReturnValue(expiresAt)

    useCase = new RegisterCodeExplanationUsageUseCase(cache)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should store the next usage count with expiration at the end of the day', async () => {
    cache.get.mockResolvedValue('3')

    await useCase.execute({ userId })

    expect(cache.set).toHaveBeenCalledWith(cacheKey, '4', { expiresAt })
  })

  it('should return the remaining uses after incrementing the usage count', async () => {
    cache.get.mockResolvedValue('3')

    const response = await useCase.execute({ userId })

    expect(response).toEqual({ remainingUses: 6 })
  })

  it('should throw when the daily limit is exhausted without writing a new value', async () => {
    cache.get.mockResolvedValue(
      String(RegisterCodeExplanationUsageUseCase.MAX_DAILY_USES),
    )

    await expect(useCase.execute({ userId })).rejects.toThrow(
      CodeExplanationLimitExceededError,
    )
    expect(cache.set).not.toHaveBeenCalled()
  })
})
