import type { RankingUser } from '@/@core/domain/entities'
import type { RankingUserDTO, TierDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IRankingsService {
  fetchTierById(tierId: string): Promise<ServiceResponse<TierDTO>>
  fetchTiers(): Promise<ServiceResponse<TierDTO[]>>
  fetchRankingUsersByTier(tierId: string): Promise<ServiceResponse<RankingUserDTO[]>>
  fetchRankingLosersByTier(tierId: string): Promise<ServiceResponse<RankingUserDTO[]>>
  fetchRankingWinnersByTier(tierId: string): Promise<ServiceResponse<RankingUserDTO[]>>
  fetchLastWeekTier(rankingUserId: string): Promise<ServiceResponse<TierDTO>>
  saveRankingLosers(losers: RankingUser[], tierId: string): Promise<ServiceResponse<true>>
  saveRankingWinners(
    winners: RankingUser[],
    tierId: string
  ): Promise<ServiceResponse<true>>
  checkRankingLoserState(rankingUserId: string): Promise<ServiceResponse<boolean>>
  updateLastWeekRankingPositions(): Promise<ServiceResponse<true>>
  resetRankingsState(): Promise<ServiceResponse<true>>
  allowUsersSeeRankingResult(): Promise<ServiceResponse<true>>
}