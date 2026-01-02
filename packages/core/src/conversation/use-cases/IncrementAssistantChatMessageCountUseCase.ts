import type { CacheProvider } from '#global/interfaces/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { Datetime } from '#global/libs/index'
import { ChatMessagesExceededError } from '../domain/errors'

type Request = {
  userId: string
}

type Response = Promise<void>

export class IncrementAssistantChatMessageCountUseCase
  implements UseCase<Request, Response>
{
  private static readonly MAX_MESSAGE_COUNT = 10

  constructor(private readonly cache: CacheProvider) {}

  async execute({ userId }: Request) {
    const cacheKey = `userId:${userId}:assistant-chat-message-count`
    const messageCount = (await this.cache.get(cacheKey)) ?? '0'
    const count = Number(messageCount)

    if (count >= IncrementAssistantChatMessageCountUseCase.MAX_MESSAGE_COUNT) {
      throw new ChatMessagesExceededError()
    } else {
      await this.cache.set(cacheKey, count + 1, {
        expiresAt: new Datetime().getEndOfDay(),
      })
    }
  }
}
