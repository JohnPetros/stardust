import type { Id, Integer } from '#global/domain/structures/index'
import type { ManyItems } from '#global/domain/types/index'
import type { ChallengeCodeExecution } from '../domain/structures'
import type { ChallengeCodeExecutionsListParams } from '../domain/types'

export interface ChallengeCodeExecutionsRepository {
  add(userId: Id, challengeId: Id, execution: ChallengeCodeExecution): Promise<void>
  findManyByUserAndChallenge(
    params: ChallengeCodeExecutionsListParams,
  ): Promise<ManyItems<ChallengeCodeExecution>>
  findLatestByUserAndChallenge(
    userId: Id,
    challengeId: Id,
  ): Promise<ChallengeCodeExecution | null>
  countIncorrectByUserAndChallenge(userId: Id, challengeId: Id): Promise<Integer>
}
