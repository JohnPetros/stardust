import type { Ranking } from '@/@types/Ranking'

export interface IRankingController {
  getRankingById(rankingId: string): Promise<Ranking>
  getRankingsOrderedByPosition(): Promise<Ranking[]>
}
