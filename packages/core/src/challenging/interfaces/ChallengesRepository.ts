import type { Id, Slug } from '#global/domain/structures/index'
import type { Challenge, ChallengeCategory } from '../domain/entities'
import type { ChallengeVote } from '../domain/structures'
import type { ChallengesListParams } from '../domain/types'

export interface ChallengesRepository {
  findById(challengeId: Id): Promise<Challenge | null>
  findBySlug(challengeSlug: Slug): Promise<Challenge | null>
  findAllByNotAuthor(authorId: Id): Promise<Challenge[]>
  findMany(
    params: ChallengesListParams,
  ): Promise<{ challenges: Challenge[]; totalChallengesCount: number }>
  findAllCategories(): Promise<ChallengeCategory[]>
  findVoteByChallengeAndUser(challengeId: Id, userId: Id): Promise<ChallengeVote>
  addVote(challengeId: Id, userId: Id, challengeVote: ChallengeVote): Promise<void>
  removeVote(challengeId: Id, userId: Id): Promise<void>
  replaceVote(challengeId: Id, userId: Id, challengeVote: ChallengeVote): Promise<void>
}
