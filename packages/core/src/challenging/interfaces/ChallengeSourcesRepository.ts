import type { Id } from '#global/domain/structures/index'
import type { ManyItems } from '../../global/domain/types'
import type { ChallengeSource } from '../domain/entities'
import type { ChallengeSourcesListParams } from '../domain/types'

export interface ChallengeSourcesRepository {
  findById(challengeSourceId: Id): Promise<ChallengeSource | null>
  findNextNotUsed(): Promise<ChallengeSource | null>
  findByChallengeId(challengeId: Id): Promise<ChallengeSource | null>
  findMany(params: ChallengeSourcesListParams): Promise<ManyItems<ChallengeSource>>
  add(challengeSource: ChallengeSource): Promise<void>
  findAll(): Promise<ChallengeSource[]>
  replace(challengeSource: ChallengeSource): Promise<void>
  replaceMany(challengeSources: ChallengeSource[]): Promise<void>
  replace(challengeSource: ChallengeSource): Promise<void>
  remove(challengeSourceId: Id): Promise<void>
}
