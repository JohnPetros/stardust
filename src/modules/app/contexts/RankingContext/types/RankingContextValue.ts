import type { Ranking } from '@/@core/domain/entities'
import type { TierDTO } from '@/@core/dtos'

export type RankingContextValue = {
  ranking: Ranking | null
  tiers: TierDTO[]
}
