import type { IRankingsService } from '@/@core/interfaces/services'
import type { TierDTO, RankingUserDTO } from '@/@core/dtos'
import type { RankingUser } from '@/@core/domain/entities'
import { ServiceResponse } from '@/@core/responses'
import { TiersFaker } from '@/@core/domain/entities/tests/fakers'
import { TIERS_COUNT } from '@/@core/domain/constants'

export class RankingsServiceMock implements IRankingsService {
  tiers: TierDTO[] = TiersFaker.fakeManyDTO(TIERS_COUNT)
  users: RankingUserDTO[] = []
  losers: RankingUserDTO[] = []
  winners: RankingUserDTO[] = []
  isReset = false
  canUsersSeeRankingResult = false
  areLastWeekRankingPositionsUpdated = false

  async fetchTierById(tierId: string): Promise<ServiceResponse<TierDTO>> {
    const tier = this.tiers.find((tier) => tier.id === tierId)
    if (tier) return new ServiceResponse(tier)

    return new ServiceResponse<TierDTO>(null)
  }

  async fetchTiers(): Promise<ServiceResponse<TierDTO[]>> {
    return new ServiceResponse(this.tiers)
  }

  async fetchRankingUsersByTier(
    tierId: string
  ): Promise<ServiceResponse<RankingUserDTO[]>> {
    const users = this.users.filter((user) => user.tierId === tierId)
    return new ServiceResponse(users)
  }

  async fetchRankingLosersByTier(
    tierId: string
  ): Promise<ServiceResponse<RankingUserDTO[]>> {
    const losers = this.losers.filter((loser) => loser.tierId === tierId)
    return new ServiceResponse(losers)
  }

  async fetchRankingWinnersByTier(
    tierId: string
  ): Promise<ServiceResponse<RankingUserDTO[]>> {
    const winners = this.winners.filter((winner) => winner.tierId === tierId)
    winners.sort((a, b) => b.xp - a.xp)
    return new ServiceResponse(winners)
  }

  async fetchLastWeekTier(rankingUserId: string): Promise<ServiceResponse<TierDTO>> {
    const user = this.users.find((user) => user.id === rankingUserId)
    if (user?.tierId) return await this.fetchTierById(user?.tierId)

    return new ServiceResponse<TierDTO>(null)
  }

  async saveRankingLosers(
    losers: RankingUser[],
    tierId: string
  ): Promise<ServiceResponse<true>> {
    for (const loser of losers) this.losers.push({ ...loser.dto, tierId })
    return new ServiceResponse(true)
  }

  async saveRankingWinners(
    winners: RankingUser[],
    tierId: string
  ): Promise<ServiceResponse<true>> {
    for (const winner of winners) this.winners.push({ ...winner.dto, tierId })
    return new ServiceResponse(true)
  }

  async checkRankingLoserState(rankingUserId: string): Promise<ServiceResponse<boolean>> {
    return new ServiceResponse(!!this.losers.find((loser) => loser.id === rankingUserId))
  }

  async resetRankingsState(): Promise<ServiceResponse<true>> {
    this.isReset = true
    return new ServiceResponse(true)
  }

  async updateLastWeekRankingPositions(): Promise<ServiceResponse<true>> {
    this.areLastWeekRankingPositionsUpdated = true
    return new ServiceResponse(true)
  }

  async allowUsersSeeRankingResult(): Promise<ServiceResponse<true>> {
    this.canUsersSeeRankingResult = true
    return new ServiceResponse(true)
  }
}
