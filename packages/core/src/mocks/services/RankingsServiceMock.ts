import type { IRankingService } from '../../global/interfaces'
import type { RankingUserDto, TierDto } from '../../ranking/dtos'
import { TIERS_COUNT } from '../../ranking/domain/constants'
import { ApiResponse } from '../../global/responses'
import { HTTP_STATUS_CODE } from '../../global/constants'
import type { RankingUser } from '../../ranking/domain/entities'
import { TiersFaker } from '#ranking/entities/fakers'

export class RankingServiceMock implements IRankingService {
  tiers: TierDto[] = TiersFaker.fakeManyDto(TIERS_COUNT)
  users: RankingUserDto[] = []
  losers: RankingUserDto[] = []
  winners: RankingUserDto[] = []
  isReset = false
  canUsersSeeRankingResult = false
  areLastWeekRankingPositionsUpdated = false

  async fetchTierById(tierId: string): Promise<ApiResponse<TierDto>> {
    const tier = this.tiers.find((tier) => tier.id === tierId)
    if (tier) return new ApiResponse({ body: tier })

    return new ApiResponse<TierDto>()
  }

  async fetchFirstTier(): Promise<ApiResponse<TierDto>> {
    throw new Error('Method not implemented.')
  }

  async fetchTiers(): Promise<ApiResponse<TierDto[]>> {
    return new ApiResponse({ body: this.tiers })
  }

  async fetchRankingUsersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>> {
    const users = this.users.filter((user) => user.tierId === tierId)
    return new ApiResponse({ body: users })
  }

  async fetchRankingLosersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>> {
    const losers = this.losers.filter((loser) => loser.tierId === tierId)
    return new ApiResponse({ body: losers })
  }

  async fetchRankingWinnersByTier(
    tierId: string,
  ): Promise<ApiResponse<RankingUserDto[]>> {
    const winners = this.winners.filter((winner) => winner.tierId === tierId)
    winners.sort((a, b) => b.xp - a.xp)
    return new ApiResponse({ body: winners })
  }

  async fetchLastWeekTier(rankingUserId: string): Promise<ApiResponse<TierDto>> {
    const user = this.users.find((user) => user.id === rankingUserId)
    if (user?.tierId) return await this.fetchTierById(user?.tierId)

    return new ApiResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async saveRankingLosers(
    losers: RankingUser[],
    tierId: string,
  ): Promise<ApiResponse<true>> {
    for (const loser of losers) this.losers.push({ ...loser.dto, tierId })
    return new ApiResponse({ statusCode: HTTP_STATUS_CODE.created })
  }

  async saveRankingWinners(winners: RankingUser[], tierId: string): Promise<ApiResponse> {
    for (const winner of winners) this.winners.push({ ...winner.dto, tierId })
    return new ApiResponse({ statusCode: HTTP_STATUS_CODE.created })
  }

  async checkRankingLoserState(rankingUserId: string): Promise<ApiResponse<boolean>> {
    return new ApiResponse({
      statusCode: this.losers.find((loser) => loser.id === rankingUserId)
        ? HTTP_STATUS_CODE.ok
        : HTTP_STATUS_CODE.notFound,
    })
  }

  async resetRankingsState(): Promise<ApiResponse<true>> {
    this.isReset = true
    return new ApiResponse()
  }

  async updateLastWeekRankingPositions(): Promise<ApiResponse<true>> {
    this.areLastWeekRankingPositionsUpdated = true
    return new ApiResponse()
  }

  async allowUsersSeeRankingResult(): Promise<ApiResponse<true>> {
    this.canUsersSeeRankingResult = true
    return new ApiResponse()
  }

  asyncfetchLastWeekRankingUserTierPosition(
    rankingUserId: string,
  ): Promise<ApiResponse<{ position: number }>> {
    throw new Error('Method not implemented.')
  }

  fetchLastWeekRankingUsersByTier(
    tierId: string,
  ): Promise<ApiResponse<RankingUserDto[]>> {
    throw new Error('Method not implemented.')
  }

  fetchLastWeekRankingUserTierPosition(
    rankingUserId: string,
  ): Promise<ApiResponse<{ position: number }>> {
    throw new Error('Method not implemented.')
  }

  updateRankingUsersTier(
    rankingUsers: RankingUser[],
    tierId: string,
  ): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }

  async fetchTierByPosition(tierPosition: number): Promise<ApiResponse<TierDto>> {
    throw new Error('Method not implemented.')
  }

  async verifyRankingLoserState(rankingUserId: string): Promise<ApiResponse<boolean>> {
    throw new Error('Method not implemented.')
  }

  async deleteLastWeekRankingUsers(): Promise<ApiResponse<true>> {
    throw new Error('Method not implemented.')
  }
  async resetRankingUsersXp(): Promise<ApiResponse<true>> {
    throw new Error('Method not implemented.')
  }
}
