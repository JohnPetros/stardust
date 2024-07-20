import { Ranking } from '@/@core/domain/entities'
import { Tier } from '@/@core/domain/entities/Tier'
import type { IRankingsService } from '@/@core/interfaces/services'

export class UpdateRankingsUseCase {
  constructor(private readonly rankingsService: IRankingsService) {}

  async do() {
    const [tiers] = await Promise.all([
      this.fetchTiers(),
      this.resetAllRankingsState(),
      this.updateLastWeekRankingPositions(),
    ])

    await Promise.all([
      this.saveLosers(tiers.slice(1)),
      this.saveWinners(tiers.slice(0, tiers.length - 1)),
      this.rankingsService.allowUsersSeeRankingResult(),
    ])
  }

  private async saveLosers(tiers: Tier[]) {
    for (let index = 1; index < tiers.length; index++) {
      const currentTierId = tiers[index].id
      const previousTierId = tiers[index - 1].id
      const ranking = await this.fetchRankingByTier(currentTierId)

      this.rankingsService.saveRankingLosers(ranking.losers, previousTierId)
    }
  }

  private async saveWinners(tiers: Tier[]) {
    for (let index = tiers.length - 2; index >= 0; index--) {
      const currentTierId = tiers[index].id
      const nextTierId = tiers[index + 1].id
      const ranking = await this.fetchRankingByTier(currentTierId)

      this.rankingsService.saveRankingWinners(ranking.winners, nextTierId)
    }
  }

  private async fetchTiers() {
    const tiersResponse = await this.rankingsService.fetchTiers()
    if (tiersResponse.isFailure) tiersResponse.throwError()
    return tiersResponse.data.map(Tier.create)
  }

  private async fetchRankingByTier(tierId: string) {
    const response = await this.rankingsService.fetchRankingUsersByTier(tierId)
    if (response.isFailure) response.throwError()
    return Ranking.create(response.data)
  }

  private async resetAllRankingsState() {
    const response = await this.rankingsService.resetRankingsState()
    if (response.isFailure) response.throwError()
  }

  private async updateLastWeekRankingPositions() {
    const response = await this.rankingsService.updateLastWeekRankingPositions()
    if (response.isFailure) response.throwError()
  }
}
