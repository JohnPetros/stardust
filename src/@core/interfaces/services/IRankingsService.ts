import type { RankingUserDTO, RankingDTO, RankingWinnerDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IRankingsService {
  fetchRankingById(rankingId: string): Promise<ServiceResponse<RankingDTO>>
  fetchRankings(): Promise<ServiceResponse<RankingDTO[]>>
  fetchRankingWinners(rankingId: string): Promise<ServiceResponse<RankingWinnerDTO[]>>
  fetchRankingUsers(rankingId: string): Promise<ServiceResponse<RankingUserDTO[]>>
}
