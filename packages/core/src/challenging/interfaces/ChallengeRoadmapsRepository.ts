import type { Id, Logical, Slug } from '#global/domain/structures/index'
import type { ChallengeRoadmap } from '../domain/structures'
import type { Challenge } from '../domain/entities'

export interface ChallengeRoadmapsRepository {
  findPublished(): Promise<ChallengeRoadmap | null>
  findNodeChallenges(nodeKey: Slug): Promise<Challenge[]>
  hasChallengeInPublishedRevision(challengeId: Id): Promise<Logical>
}
