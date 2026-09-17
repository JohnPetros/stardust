import { IdsList } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeRoadmapDto } from '../domain/structures/dtos'
import { ChallengeRoadmapNotFoundError } from '../domain/errors'
import type { ChallengeRoadmapsRepository } from '../interfaces'

type Request = {
  completedChallengeIds?: string[]
}

export class GetChallengeRoadmapUseCase
  implements UseCase<Request, Promise<ChallengeRoadmapDto>>
{
  constructor(private readonly repository: ChallengeRoadmapsRepository) {}

  async execute({ completedChallengeIds }: Request = {}): Promise<ChallengeRoadmapDto> {
    const roadmap = await this.findPublishedRoadmap()
    return roadmap.toDto(this.createCompletedIds(completedChallengeIds))
  }

  private async findPublishedRoadmap() {
    const roadmap = await this.repository.findPublished()
    if (!roadmap) throw new ChallengeRoadmapNotFoundError()
    return roadmap
  }

  private createCompletedIds(completedChallengeIds?: string[]) {
    return completedChallengeIds === undefined
      ? undefined
      : IdsList.create(completedChallengeIds)
  }
}
