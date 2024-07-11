import type { RankingDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface IRankingsService {
  fetchRankingById(rankingId: string): Promise<ServiceResponse<RankingDTO>>
  fetchRankingsOrderedByPosition(): Promise<ServiceResponse<RankingDTO[]>>
}
