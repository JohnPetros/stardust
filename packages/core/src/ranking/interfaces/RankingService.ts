import type { RestResponse } from '@/global/responses'
import type { RankingUserDto, TierDto } from '../domain/entities/dtos'
import type { RankingUser } from '../domain/entities'

export interface RankingService {
  fetchTierById(tierId: string): Promise<RestResponse<TierDto>>
  fetchTierByPosition(tierPosition: number): Promise<RestResponse<TierDto>>
  fetchTiers(): Promise<RestResponse<TierDto[]>>
  fetchFirstTier(): Promise<RestResponse<TierDto>>
  fetchRankingUsersByTier(tierId: string): Promise<RestResponse<RankingUserDto[]>>
  fetchLastWeekRankingUsersByTier(tierId: string): Promise<RestResponse<RankingUserDto[]>>
  fetchRankingLosersByTier(tierId: string): Promise<RestResponse<RankingUserDto[]>>
  fetchRankingWinnersByTier(tierId: string): Promise<RestResponse<RankingUserDto[]>>
  saveRankingLosers(losers: RankingUser[], tierId: string): Promise<RestResponse>
  saveRankingWinners(winners: RankingUser[], tierId: string): Promise<RestResponse>
  fetchLastWeekRankingUserTierPosition(
    rankingUserId: string,
  ): Promise<RestResponse<{ position: number }>>
  updateLastWeekRankingPositions(): Promise<RestResponse>
  updateRankingUsersTier(
    rankingUsers: RankingUser[],
    tierId: string,
  ): Promise<RestResponse>
  allowUsersSeeRankingResult(): Promise<RestResponse>
  deleteLastWeekRankingUsers(): Promise<RestResponse>
  resetRankingUsersXp(): Promise<RestResponse>
}
