import type { Id } from '#global/domain/structures/index'
import type { Challenge } from '../domain/entities'

export interface ChallengesRepository {
  findById(challengeId: Id): Promise<Challenge | null>
}
