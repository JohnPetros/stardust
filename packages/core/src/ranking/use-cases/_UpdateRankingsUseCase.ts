import type { Id } from '#global/domain/structures/Id'
import type { EventBroker } from '#global/interfaces/EventBroker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Tier } from '../domain/entities'
import {
  RankingLosersDefinedEvent,
  RankingUpdatedEvent,
  RankingWinnersDefinedEvent,
} from '../domain/events'
import { Ranking } from '../domain/structures'
import type { RankersRepository, TiersRepository } from '../interfaces'

export class _UpdateRankingsUseCase implements UseCase<void, void> {
  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async execute() {
    const [tiers] = await Promise.all([
      this.tiersRepository.findAll(),
      this.rankersRepository.removeAll(),
    ])
    await this.addLosers(tiers)
    await this.addWinners(tiers)

    for (const tier of tiers)
      await this.eventBroker.publish(new RankingUpdatedEvent({ tierId: tier.id.value }))
  }

  private async addLosers(tiers: Tier[]) {
    for (let index = 0; index < tiers.length; index++) {
      const currentTier = tiers[index]
      if (!currentTier) continue
      let previousTier = tiers[index - 1]
      previousTier = !previousTier ? currentTier : previousTier

      const ranking = await this.findRankingByTier(currentTier.id)
      const losers = ranking.losers

      await this.rankersRepository.addLosers(losers, currentTier.id)

      if (previousTier.isEqualTo(currentTier).isFalse) {
        const event = new RankingLosersDefinedEvent({
          tierId: previousTier.id.value,
          losersIds: losers.map((loser) => loser.id.value),
        })
        await this.eventBroker.publish(event)
      }
    }
  }

  private async addWinners(tiers: Tier[]) {
    for (let index = tiers.length - 1; index >= 0; index--) {
      const currentTier = tiers[index]
      if (!currentTier) continue
      let nextTier = tiers[index + 1]
      nextTier = !nextTier ? currentTier : nextTier

      const ranking = await this.findRankingByTier(currentTier.id)
      const winners = ranking.winners

      await this.rankersRepository.addWinners(winners, currentTier.id)

      if (nextTier.isEqualTo(currentTier).isFalse) {
        const event = new RankingWinnersDefinedEvent({
          tierId: nextTier.id.value,
          winnersIds: winners.map((winner) => winner.id.value),
        })
        await this.eventBroker.publish(event)
      }
    }
  }

  private async findRankingByTier(tierId: Id) {
    const rankers = await this.rankersRepository.findAllByTier(tierId)
    return Ranking.create(rankers.map((ranker) => ranker.dto))
  }
}
