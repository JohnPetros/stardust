import { mock, type Mock } from 'ts-jest-mocker'

import { Datetime } from '#global/libs/index'
import type { CacheProvider } from '#global/interfaces/index'
import { ChatMessagesExceededError } from '../../domain/errors'
import { IncrementAssistantChatMessageCountUseCase } from '../IncrementAssistantChatMessageCountUseCase'

describe('Increment Assistant Chat Message Count Use Case', () => {
  let cache: Mock<CacheProvider>
  let useCase: IncrementAssistantChatMessageCountUseCase
  const userId = 'user-id'
  const cacheKey = `userId:${userId}:assistant-chat-message-count`
  const expiresAt = new Date('2024-01-01T23:59:59Z')

  beforeEach(() => {
    cache = mock<CacheProvider>()
    cache.get.mockImplementation()
    cache.set.mockImplementation()
    jest.spyOn(Datetime.prototype, 'getEndOfDay').mockReturnValue(expiresAt)

    useCase = new IncrementAssistantChatMessageCountUseCase(cache)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should initialize the message count when there is no cached value', async () => {
    cache.get.mockResolvedValue(null)

    await useCase.execute({ userId })

    expect(cache.set).toHaveBeenCalledWith(cacheKey, 1, { expiresAt })
  })

  it('should increment the message count while within the limit', async () => {
    cache.get.mockResolvedValue('4')

    await useCase.execute({ userId })

    expect(cache.set).toHaveBeenCalledWith(cacheKey, 5, { expiresAt })
  })

  it('should throw when the user already exceeded the limit', async () => {
    cache.get.mockResolvedValue('6')

    await expect(useCase.execute({ userId })).rejects.toThrow(ChatMessagesExceededError)
    expect(cache.set).not.toHaveBeenCalled()
  })
})
