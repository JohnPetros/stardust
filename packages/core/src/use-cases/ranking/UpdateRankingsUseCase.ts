import { Ranking, type RankingUser } from '@/@core/domain/entities'
import { Tier } from '@/@core/domain/entities/Tier'
import type { IRankingsService } from '@/@core/interfaces/services'

export class UpdateRankingsUseCase {
  constructor(private readonly rankingsService: IRankingsService) {}

  async do() {
    const [tiers] = await Promise.all([
      this.fetchTiers(),
      this.deleteLastWeekRankingUsers(),
      this.updateLastWeekRankingPositions(),
    ])

    await this.saveLosers(tiers)
    await this.saveWinners(tiers)
    await this.rankingsService.allowUsersSeeRankingResult()

    await this.resetRankingUsersXp()
  }

  private async saveLosers(tiers: Tier[]) {
    for (let index = 0; index < tiers.length; index++) {
      const currentTier = tiers[index]
      let previousTier = tiers[index - 1]
      previousTier = !previousTier ? currentTier : previousTier

      const ranking = await this.fetchRankingByTier(currentTier.id)
      const losers = ranking.losers

      const response = await this.rankingsService.saveRankingLosers(
        losers,
        currentTier.id
      )

      if (response.isFailure) {
        await this.deleteLastWeekRankingUsers()
        response.throwError()
      }

      if (!previousTier.isEqualTo(currentTier)) {
        await this.updateRankingUsersTier(losers, previousTier.id)
      }
    }
  }

  private async saveWinners(tiers: Tier[]) {
    for (let index = tiers.length - 1; index >= 0; index--) {
      const currentTier = tiers[index]
      let nextTier = tiers[index + 1]
      nextTier = !nextTier ? currentTier : nextTier

      const ranking = await this.fetchRankingByTier(currentTier.id)
      const winners = ranking.winners

      const response = await this.rankingsService.saveRankingWinners(
        winners,
        currentTier.id
      )

      if (response.isFailure) {
        await this.deleteLastWeekRankingUsers()
        response.throwError()
      }

      if (!nextTier.isEqualTo(currentTier)) {
        await this.updateRankingUsersTier(winners, nextTier.id)
      }
    }
  }

  private async fetchTiers() {
    const tiersResponse = await this.rankingsService.fetchTiers()
    if (tiersResponse.isFailure) tiersResponse.throwError()
    return tiersResponse.data.map(Tier.create)
  }

  private async fetchRankingByTier(tierId: string) {
    const response = await this.rankingsService.fetchLastWeekRankingUsersByTier(tierId)
    if (response.isFailure) response.throwError()
    return Ranking.create(response.data)
  }

  private async deleteLastWeekRankingUsers() {
    const response = await this.rankingsService.deleteLastWeekRankingUsers()
    if (response.isFailure) response.throwError()
  }

  private async resetRankingUsersXp() {
    const response = await this.rankingsService.resetRankingUsersXp()
    if (response.isFailure) response.throwError()
  }

  private async updateLastWeekRankingPositions() {
    const response = await this.rankingsService.updateLastWeekRankingPositions()
    if (response.isFailure) response.throwError()
  }

  private async updateRankingUsersTier(rankingUsers: RankingUser[], tierId: string) {
    const response = await this.rankingsService.updateRankingUsersTier(
      rankingUsers,
      tierId
    )
    if (response.isFailure) response.throwError()
  }
}
