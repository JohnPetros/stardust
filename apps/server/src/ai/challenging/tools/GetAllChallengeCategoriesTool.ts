import type { Mcp, Tool } from '@stardust/core/global/interfaces'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

type Output = ChallengeCategoryDto[]

export class GetAllChallengeCategoriesTool implements Tool<void, Output> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(_: Mcp): Promise<Output> {
    const challengeCategories = await this.repository.findAllCategories()
    return challengeCategories.map((category) => category.dto)
  }
}
