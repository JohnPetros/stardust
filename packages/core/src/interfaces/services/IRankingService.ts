import type { RankingUser } from '#ranking/entities'
import type { RankingUserDto, TierDto } from '#ranking/dtos'
import type { ApiResponse } from '#responses'

export interface IRankingService {
  fetchTierById(tierId: string): Promise<ApiResponse<TierDto>>
  fetchTierByPosition(tierPosition: number): Promise<ApiResponse<TierDto>>
  fetchTiers(): Promise<ApiResponse<TierDto[]>>
  fetchRankingUsersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  fetchLastWeekRankingUsersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  fetchRankingLosersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  fetchRankingWinnersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  saveRankingLosers(losers: RankingUser[], tierId: string): Promise<ApiResponse<true>>
  saveRankingWinners(winners: RankingUser[], tierId: string): Promise<ApiResponse<true>>
  verifyRankingLoserState(rankingUserId: string): Promise<ApiResponse<boolean>>
  updateLastWeekRankingPositions(): Promise<ApiResponse<true>>
  updateRankingUsersTier(
    rankingUsers: RankingUser[],
    tierId: string,
  ): Promise<ApiResponse<true>>
  allowUsersSeeRankingResult(): Promise<ApiResponse<true>>
  deleteLastWeekRankingUsers(): Promise<ApiResponse<true>>
  resetRankingUsersXp(): Promise<ApiResponse<true>>
}
