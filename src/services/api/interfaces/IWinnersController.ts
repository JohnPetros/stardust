import type { Winner } from '@/@types/Winner'

export interface IWinnersController {
  getWinnersByRankingId(rankingId: string): Promise<Winner[]>
}
