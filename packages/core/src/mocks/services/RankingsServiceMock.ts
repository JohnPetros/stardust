import type { RankingService } from '../../global/interfaces'
import type { RankingUserDto, TierDto } from '../../ranking/dtos'
import { TIERS_COUNT } from '../../ranking/domain/constants'
import { RestResponse } from '../../global/responses'
import { HTTP_STATUS_CODE } from '../../global/constants'
import type { RankingUser } from '../../ranking/domain/entities'
import { TiersFaker } from '#ranking/entities/fakers'

export class RankingServiceMock implements RankingService {
  tiers: TierDto[] = TiersFaker.fakeManyDto(TIERS_COUNT)
  users: RankingUserDto[] = []
  losers: RankingUserDto[] = []
  winners: RankingUserDto[] = []
  isReset = false
  canUsersSeeRankingResult = false
  areLastWeekRankingPositionsUpdated = false

  async fetchTierById(tierId: string): Promise<RestResponse<TierDto>> {
    const tier = this.tiers.find((tier) => tier.id === tierId)
    if (tier) return new RestResponse({ body: tier })

    return new RestResponse<TierDto>()
  }

  async fetchFirstTier(): Promise<RestResponse<TierDto>> {
    throw new Error('Method not implemented.')
  }

  async fetchTiers(): Promise<RestResponse<TierDto[]>> {
    return new RestResponse({ body: this.tiers })
  }

  async fetchRankingUsersByTier(tierId: string): Promise<RestResponse<RankingUserDto[]>> {
    const users = this.users.filter((user) => user.tierId === tierId)
    return new RestResponse({ body: users })
  }

  async fetchRankingLosersByTier(
    tierId: string,
  ): Promise<RestResponse<RankingUserDto[]>> {
    const losers = this.losers.filter((loser) => loser.tierId === tierId)
    return new RestResponse({ body: losers })
  }

  async fetchRankingWinnersByTier(
    tierId: string,
  ): Promise<RestResponse<RankingUserDto[]>> {
    const winners = this.winners.filter((winner) => winner.tierId === tierId)
    winners.sort((a, b) => b.xp - a.xp)
    return new RestResponse({ body: winners })
  }

  async fetchLastWeekTier(rankingUserId: string): Promise<RestResponse<TierDto>> {
    const user = this.users.find((user) => user.id === rankingUserId)
    if (user?.tierId) return await this.fetchTierById(user?.tierId)

    return new RestResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async saveRankingLosers(
    losers: RankingUser[],
    tierId: string,
  ): Promise<RestResponse<true>> {
    for (const loser of losers) this.losers.push({ ...loser.dto, tierId })
    return new RestResponse({ statusCode: HTTP_STATUS_CODE.created })
  }

  async saveRankingWinners(
    winners: RankingUser[],
    tierId: string,
  ): Promise<RestResponse> {
    for (const winner of winners) this.winners.push({ ...winner.dto, tierId })
    return new RestResponse({ statusCode: HTTP_STATUS_CODE.created })
  }

  async checkRankingLoserState(rankingUserId: string): Promise<RestResponse<boolean>> {
    return new RestResponse({
      statusCode: this.losers.find((loser) => loser.id === rankingUserId)
        ? HTTP_STATUS_CODE.ok
        : HTTP_STATUS_CODE.notFound,
    })
  }

  async resetRankingsState(): Promise<RestResponse<true>> {
    this.isReset = true
    return new RestResponse()
  }

  async updateLastWeekRankingPositions(): Promise<RestResponse<true>> {
    this.areLastWeekRankingPositionsUpdated = true
    return new RestResponse()
  }

  async allowUsersSeeRankingResult(): Promise<RestResponse<true>> {
    this.canUsersSeeRankingResult = true
    return new RestResponse()
  }

  asyncfetchLastWeekRankingUserTierPosition(
    rankingUserId: string,
  ): Promise<RestResponse<{ position: number }>> {
    throw new Error('Method not implemented.')
  }

  fetchLastWeekRankingUsersByTier(
    tierId: string,
  ): Promise<RestResponse<RankingUserDto[]>> {
    throw new Error('Method not implemented.')
  }

  fetchLastWeekRankingUserTierPosition(
    rankingUserId: string,
  ): Promise<RestResponse<{ position: number }>> {
    throw new Error('Method not implemented.')
  }

  updateRankingUsersTier(
    rankingUsers: RankingUser[],
    tierId: string,
  ): Promise<RestResponse> {
    throw new Error('Method not implemented.')
  }

  async fetchTierByPosition(tierPosition: number): Promise<RestResponse<TierDto>> {
    throw new Error('Method not implemented.')
  }

  async verifyRankingLoserState(rankingUserId: string): Promise<RestResponse<boolean>> {
    throw new Error('Method not implemented.')
  }

  async deleteLastWeekRankingUsers(): Promise<RestResponse<true>> {
    throw new Error('Method not implemented.')
  }
  async resetRankingUsersXp(): Promise<RestResponse<true>> {
    throw new Error('Method not implemented.')
  }
}
