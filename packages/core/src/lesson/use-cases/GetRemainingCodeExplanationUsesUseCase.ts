import type { CacheProvider } from '#global/interfaces/index'
import type { UseCase } from '#global/interfaces/UseCase'

type Request = {
  userId: string
}

type Response = Promise<{ remainingUses: number }>

export class GetRemainingCodeExplanationUsesUseCase
  implements UseCase<Request, Response>
{
  static readonly MAX_DAILY_USES = 10

  constructor(private readonly cache: CacheProvider) {}

  async execute({ userId }: Request) {
    const cacheKey = `userId:${userId}:code-explanation-usage-count`
    const usageCount = (await this.cache.get(cacheKey)) ?? '0'
    const count = Number(usageCount)
    const remainingUses = Math.max(
      0,
      GetRemainingCodeExplanationUsesUseCase.MAX_DAILY_USES - count,
    )

    return { remainingUses }
  }
}
