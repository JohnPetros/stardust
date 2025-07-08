import type { Id } from '#global/domain/structures/Id'
import type { RankingUser } from '../domain/entities'

export interface RankersRepository {
  findAllByTier(tierId: Id): Promise<RankingUser[]>
  findAllByTierOrderedByXp(tierId: Id): Promise<RankingUser[]>
  addWinners(rankingWinners: RankingUser[], tierId: Id): Promise<void>
  addLosers(rankingLosers: RankingUser[], tierId: Id): Promise<void>
  removeAll(): Promise<void>
}
