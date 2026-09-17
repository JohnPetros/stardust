import { IdsList, Slug } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { ChallengeRoadmapNotFoundError } from '../domain/errors'
import type { RoadmapNodeChallengesDto } from '../domain/structures/dtos'
import type { ChallengeRoadmapsRepository } from '../interfaces'

type Request = {
  nodeKey: string
  completedChallengeIds?: string[]
}

export class ListRoadmapNodeChallengesUseCase
  implements UseCase<Request, Promise<RoadmapNodeChallengesDto>>
{
  constructor(private readonly repository: ChallengeRoadmapsRepository) {}

  async execute({ nodeKey, completedChallengeIds }: Request) {
    return this.listNodeChallenges(nodeKey, completedChallengeIds)
  }

  private async listNodeChallenges(nodeKey: string, completedChallengeIds?: string[]) {
    const { roadmap, key } = await this.findRoadmapNode(nodeKey)
    return this.createNodeChallenges(roadmap, key, completedChallengeIds)
  }

  private async createNodeChallenges(
    roadmap: Awaited<ReturnType<typeof this.findPublishedRoadmap>>,
    key: Slug,
    completedChallengeIds?: string[],
  ) {
    const challenges = await this.repository.findNodeChallenges(key)
    return roadmap.toNodeChallengesDto(
      key,
      challenges,
      this.createCompletedIds(completedChallengeIds),
    )
  }

  private async findRoadmapNode(nodeKey: string) {
    const roadmap = await this.findPublishedRoadmap()
    const key = Slug.create(nodeKey)
    this.ensureNodeExists(roadmap, key)
    return { roadmap, key }
  }

  private async findPublishedRoadmap() {
    const roadmap = await this.repository.findPublished()
    if (!roadmap) throw new ChallengeRoadmapNotFoundError()
    return roadmap
  }

  private ensureNodeExists(
    roadmap: Awaited<ReturnType<typeof this.findPublishedRoadmap>>,
    key: Slug,
  ) {
    if (roadmap.hasNode(key).isFalse) throw new ChallengeRoadmapNotFoundError()
  }

  private createCompletedIds(completedChallengeIds?: string[]) {
    return completedChallengeIds === undefined
      ? undefined
      : IdsList.create(completedChallengeIds)
  }
}
