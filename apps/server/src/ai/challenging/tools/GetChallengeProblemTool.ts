import { CACHE } from '@/constants'
import type { CacheProvider, Mcp, Tool } from '@stardust/core/global/interfaces'
import { ChallengeProblemNotFoundError } from '@stardust/core/challenging/errors'

export class GetChallengeProblemTool implements Tool {
  constructor(private readonly cacheProvider: CacheProvider) {}

  async handle(_: Mcp) {
    const challengeProblem = await this.cacheProvider.getListItem(
      CACHE.challenging.challengeProblems.key,
      0,
    )
    if (!challengeProblem) {
      throw new ChallengeProblemNotFoundError()
    }

    return {
      problem: challengeProblem,
    }
  }
}
