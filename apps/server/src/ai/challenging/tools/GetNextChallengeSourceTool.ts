import type { ChallengeSourceDto } from '@stardust/core/challenging/entities/dtos'
import type { ChallengeSourcesRepository } from '@stardust/core/challenging/interfaces'
import { GetNextChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'
import type { Mcp, Tool } from '@stardust/core/global/interfaces'

export class GetNextChallengeSourceTool implements Tool<void, ChallengeSourceDto> {
  constructor(private readonly repository: ChallengeSourcesRepository) {}

  async handle(_: Mcp<void>): Promise<ChallengeSourceDto> {
    const useCase = new GetNextChallengeSourceUseCase(this.repository)
    return await useCase.execute()
  }
}
