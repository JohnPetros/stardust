import type { Ranking, Tier } from '@/@core/domain/entities'

export type RankingContextValue = {
  ranking: Ranking | null
  tiers: Tier[]
}
