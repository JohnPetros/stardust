import type { Ranking } from '@/@types/ranking'

export interface IRankingController {
  getRankingById(rankingId: string): Promise<Ranking>
  getRankingsOrderedByPosition(): Promise<Ranking[]>
}
