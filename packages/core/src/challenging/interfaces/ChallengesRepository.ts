import type { Id, Slug } from '#global/domain/structures/index'
import type { Challenge } from '../domain/entities'
import type { ChallengesListParams } from '../domain/types'

export interface ChallengesRepository {
  findById(challengeId: Id): Promise<Challenge | null>
  findBySlug(challengeSlug: Slug): Promise<Challenge | null>
  findAllByNotAuthor(authorId: Id): Promise<Challenge[]>
  findMany(
    params: ChallengesListParams,
  ): Promise<{ challenges: Challenge[]; totalChallengesCount: number }>
}
