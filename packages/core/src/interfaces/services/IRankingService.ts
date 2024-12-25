import type { RankingUser } from '#ranking/entities'
import type { RankingUserDto, TierDto } from '#ranking/dtos'
import type { ApiResponse } from '#responses'

export interface IRankingService {
  fetchTierById(tierId: string): Promise<ApiResponse<TierDto>>
  fetchTierByPosition(tierPosition: number): Promise<ApiResponse<TierDto>>
  fetchTiers(): Promise<ApiResponse<TierDto[]>>
  fetchFirstTier(): Promise<ApiResponse<TierDto>>
  fetchRankingUsersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  fetchLastWeekRankingUsersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  fetchRankingLosersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  fetchRankingWinnersByTier(tierId: string): Promise<ApiResponse<RankingUserDto[]>>
  saveRankingLosers(losers: RankingUser[], tierId: string): Promise<ApiResponse>
  saveRankingWinners(winners: RankingUser[], tierId: string): Promise<ApiResponse>
  verifyRankingLoserState(rankingUserId: string): Promise<ApiResponse>
  updateLastWeekRankingPositions(): Promise<ApiResponse>
  updateRankingUsersTier(
    rankingUsers: RankingUser[],
    tierId: string,
  ): Promise<ApiResponse>
  allowUsersSeeRankingResult(): Promise<ApiResponse>
  deleteLastWeekRankingUsers(): Promise<ApiResponse>
  resetRankingUsersXp(): Promise<ApiResponse>
}
