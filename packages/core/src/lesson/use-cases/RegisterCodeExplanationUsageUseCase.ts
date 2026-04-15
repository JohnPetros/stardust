import type { CacheProvider } from '#global/interfaces/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { Datetime } from '#global/libs/index'
import { CodeExplanationLimitExceededError } from '../domain/errors'

type Request = {
  userId: string
}

type Response = Promise<{ remainingUses: number }>

export class RegisterCodeExplanationUsageUseCase implements UseCase<Request, Response> {
  static readonly MAX_DAILY_USES = 10

  constructor(private readonly cache: CacheProvider) {}

  async execute({ userId }: Request) {
    const cacheKey = `userId:${userId}:code-explanation-usage-count`
    const usageCount = (await this.cache.get(cacheKey)) ?? '0'
    const count = Number(usageCount)

    if (count >= RegisterCodeExplanationUsageUseCase.MAX_DAILY_USES) {
      throw new CodeExplanationLimitExceededError()
    }

    const nextCount = count + 1

    await this.cache.set(cacheKey, String(nextCount), {
      expiresAt: new Datetime().getEndOfDay(),
    })

    return {
      remainingUses: Math.max(
        0,
        RegisterCodeExplanationUsageUseCase.MAX_DAILY_USES - nextCount,
      ),
    }
  }
}
