import type { RankingUser } from '@/@core/domain/entities'
import type { RankingUserDto, TierDto } from '#dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IRankingsService {
  fetchTierById(tierId: string): Promise<ServiceResponse<TierDto>>
  fetchTierByPosition(tierPosition: number): Promise<ServiceResponse<TierDto>>
  fetchTiers(): Promise<ServiceResponse<TierDto[]>>
  fetchRankingUsersByTier(tierId: string): Promise<ServiceResponse<RankingUserDto[]>>
  fetchLastWeekRankingUsersByTier(
    tierId: string,
  ): Promise<ServiceResponse<RankingUserDto[]>>
  fetchRankingLosersByTier(tierId: string): Promise<ServiceResponse<RankingUserDto[]>>
  fetchRankingWinnersByTier(tierId: string): Promise<ServiceResponse<RankingUserDto[]>>
  saveRankingLosers(losers: RankingUser[], tierId: string): Promise<ServiceResponse<true>>
  saveRankingWinners(
    winners: RankingUser[],
    tierId: string,
  ): Promise<ServiceResponse<true>>
  verifyRankingLoserState(rankingUserId: string): Promise<ServiceResponse<boolean>>
  updateLastWeekRankingPositions(): Promise<ServiceResponse<true>>
  updateRankingUsersTier(
    rankingUsers: RankingUser[],
    tierId: string,
  ): Promise<ServiceResponse<true>>
  allowUsersSeeRankingResult(): Promise<ServiceResponse<true>>
  deleteLastWeekRankingUsers(): Promise<ServiceResponse<true>>
  resetRankingUsersXp(): Promise<ServiceResponse<true>>
}
