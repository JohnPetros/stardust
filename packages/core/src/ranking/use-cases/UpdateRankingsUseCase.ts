import { Tier, type RankingUser } from '../domain/entities'
import { Ranking } from '../domain/structures'
import type { RankingService } from '../interfaces'

export class UpdateRankingsUseCase {
  constructor(private readonly rankingService: RankingService) {}

  async execute() {
    const [tiers] = await Promise.all([
      this.fetchTiers(),
      this.deleteLastWeekRankingUsers(),
      this.updateLastWeekRankingPositions(),
    ])
    await this.saveLosers(tiers)
    await this.saveWinners(tiers)
    await this.rankingService.allowUsersSeeRankingResult()
    await this.resetRankingUsersXp()
  }

  private async saveLosers(tiers: Tier[]) {
    for (let index = 0; index < tiers.length; index++) {
      const currentTier = tiers[index]
      if (!currentTier) continue
      let previousTier = tiers[index - 1]
      previousTier = !previousTier ? currentTier : previousTier

      const ranking = await this.fetchRankingByTier(currentTier.id.value)
      const losers = ranking.losers

      const response = await this.rankingService.saveRankingLosers(
        losers,
        currentTier.id.value,
      )

      if (response.isFailure) {
        await this.deleteLastWeekRankingUsers()
        response.throwError()
      }

      if (!previousTier.isEqualTo(currentTier)) {
        await this.updateRankingUsersTier(losers, previousTier.id.value)
      }
    }
  }

  private async saveWinners(tiers: Tier[]) {
    for (let index = tiers.length - 1; index >= 0; index--) {
      const currentTier = tiers[index]
      if (!currentTier) continue
      let nextTier = tiers[index + 1]
      nextTier = !nextTier ? currentTier : nextTier

      const ranking = await this.fetchRankingByTier(currentTier.id.value)
      const winners = ranking.winners

      const response = await this.rankingService.saveRankingWinners(
        winners,
        currentTier.id.value,
      )

      if (response.isFailure) {
        await this.deleteLastWeekRankingUsers()
        response.throwError()
      }

      if (!nextTier.isEqualTo(currentTier)) {
        await this.updateRankingUsersTier(winners, nextTier.id.value)
      }
    }
  }

  private async fetchTiers() {
    const tiersResponse = await this.rankingService.fetchTiers()
    if (tiersResponse.isFailure) tiersResponse.throwError()
    return tiersResponse.body.map(Tier.create)
  }

  private async fetchRankingByTier(tierId: string) {
    const response = await this.rankingService.fetchLastWeekRankingUsersByTier(tierId)
    if (response.isFailure) response.throwError()
    return Ranking.create(response.body)
  }

  private async deleteLastWeekRankingUsers() {
    const response = await this.rankingService.deleteLastWeekRankingUsers()
    if (response.isFailure) response.throwError()
  }

  private async resetRankingUsersXp() {
    const response = await this.rankingService.resetRankingUsersXp()
    if (response.isFailure) response.throwError()
  }

  private async updateLastWeekRankingPositions() {
    const response = await this.rankingService.updateLastWeekRankingPositions()
    if (response.isFailure) response.throwError()
  }

  private async updateRankingUsersTier(rankingUsers: RankingUser[], tierId: string) {
    const response = await this.rankingService.updateRankingUsersTier(
      rankingUsers,
      tierId,
    )
    if (response.isFailure) response.throwError()
  }
}
