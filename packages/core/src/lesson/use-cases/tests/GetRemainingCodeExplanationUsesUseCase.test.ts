import { mock, type Mock } from 'ts-jest-mocker'

import type { CacheProvider } from '#global/interfaces/index'
import { GetRemainingCodeExplanationUsesUseCase } from '../GetRemainingCodeExplanationUsesUseCase'

describe('Get Remaining Code Explanation Uses Use Case', () => {
  let cache: Mock<CacheProvider>
  let useCase: GetRemainingCodeExplanationUsesUseCase

  const userId = 'user-id'
  const cacheKey = `userId:${userId}:code-explanation-usage-count`

  beforeEach(() => {
    cache = mock<CacheProvider>()
    cache.get.mockImplementation()

    useCase = new GetRemainingCodeExplanationUsesUseCase(cache)
  })

  it('should return the full daily amount when there is no cached value', async () => {
    cache.get.mockResolvedValue(null)

    const result = await useCase.execute({ userId })

    expect(result).toEqual({ remainingUses: 10 })
    expect(cache.get).toHaveBeenCalledWith(cacheKey)
  })

  it('should return the remaining uses after partial usage', async () => {
    cache.get.mockResolvedValue('4')

    const result = await useCase.execute({ userId })

    expect(result).toEqual({ remainingUses: 6 })
    expect(cache.get).toHaveBeenCalledWith(cacheKey)
  })

  it('should never return a negative remaining uses count', async () => {
    cache.get.mockResolvedValue('12')

    const result = await useCase.execute({ userId })

    expect(result).toEqual({ remainingUses: 0 })
    expect(cache.get).toHaveBeenCalledWith(cacheKey)
  })
})
