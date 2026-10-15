import type { Database } from '#global/interfaces/Database'
import type { Id } from '#global/domain/structures/Id'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Tier } from '../domain/entities'
import {
  RankingLosersDefinedEvent,
  RankingUpdatedEvent,
  RankingWinnersDefinedEvent,
} from '../domain/events'
import { Ranking } from '../domain/structures'
import type { RankersRepository, TiersRepository } from '../interfaces'

export class UpdateRankingsUseCase implements UseCase<void, void> {
  constructor(
    private readonly database: Database,
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
    private readonly broker: Broker,
  ) {}

  async execute() {
    return this.database.run(() => this.updateInTransaction())
  }

  private async updateInTransaction() {
    const tiers = await this.resetRankings()
    await this.addLosers(tiers)
    await this.addWinners(tiers)

    for (const tier of tiers)
      await this.broker.publish(new RankingUpdatedEvent({ tierId: tier.id.value }))
  }

  private async addLosers(tiers: Tier[]) {
    for (const [index, tier] of tiers.entries()) {
      await this.addTierLosers(tier, tiers[index - 1] ?? tier)
    }
  }

  private async addTierLosers(current: Tier, previous: Tier) {
    const ranking = await this.findRankingByTier(current.id)
    await this.rankersRepository.addLosers(ranking.losers, current.id)
    if (previous.isEqualTo(current).isFalse) {
      await this.broker.publish(this.losersEvent(previous, ranking))
    }
  }

  private losersEvent(tier: Tier, ranking: Ranking) {
    return new RankingLosersDefinedEvent({
      tierId: tier.id.value,
      losersIds: ranking.losers.map((loser) => loser.id.value),
    })
  }

  private async addWinners(tiers: Tier[]) {
    for (let index = tiers.length - 1; index >= 0; index--) {
      const tier = tiers[index]
      if (tier) await this.addTierWinners(tier, tiers[index + 1] ?? tier)
    }
  }

  private async addTierWinners(current: Tier, next: Tier) {
    const ranking = await this.findRankingByTier(current.id)
    await this.rankersRepository.addWinners(ranking.winners, current.id)
    if (next.isEqualTo(current).isFalse) {
      await this.broker.publish(this.winnersEvent(next, ranking))
    }
  }

  private winnersEvent(tier: Tier, ranking: Ranking) {
    return new RankingWinnersDefinedEvent({
      tierId: tier.id.value,
      winnersIds: ranking.winners.map((winner) => winner.id.value),
    })
  }

  private async findRankingByTier(tierId: Id) {
    const rankers = await this.rankersRepository.findAllByTier(tierId)
    return Ranking.create(rankers.map((ranker) => ranker.dto))
  }
  private async resetRankings() {
    const [tiers] = await Promise.all([
      this.tiersRepository.findAll(),
      this.rankersRepository.removeAll(),
    ])
    return tiers
  }
}
