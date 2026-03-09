import type { Id, Integer, Month, Slug } from '#global/domain/structures/index'
import type { ManyItems } from '../../global/domain/types'
import type { Challenge, ChallengeCategory } from '../domain/entities'
import type { ChallengeVote } from '../domain/structures'
import type { ChallengesListParams } from '../domain/types'

export interface ChallengesRepository {
  findById(challengeId: Id): Promise<Challenge | null>
  findBySlug(challengeSlug: Slug): Promise<Challenge | null>
  findByStar(starId: Id): Promise<Challenge | null>
  findAllByNotAuthor(authorId: Id): Promise<Challenge[]>
  findMany(params: ChallengesListParams): Promise<ManyItems<Challenge>>
  findAllCategories(): Promise<ChallengeCategory[]>
  findVoteByChallengeAndUser(challengeId: Id, userId: Id): Promise<ChallengeVote>
  add(challenge: Challenge): Promise<void>
  addVote(challengeId: Id, userId: Id, challengeVote: ChallengeVote): Promise<void>
  replace(challenge: Challenge): Promise<void>
  remove(challenge: Challenge): Promise<void>
  removeVote(challengeId: Id, userId: Id): Promise<void>
  replaceVote(challengeId: Id, userId: Id, challengeVote: ChallengeVote): Promise<void>
  countAll(): Promise<Integer>
  countByMonth(month: Month): Promise<Integer>
  expireNewChallengesOlderThanOneWeek(): Promise<void>
}
