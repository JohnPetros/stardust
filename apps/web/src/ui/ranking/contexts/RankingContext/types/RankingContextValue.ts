import type { Tier } from '@stardust/core/ranking/entities'
import type { Ranking } from '@stardust/core/ranking/structures'

export type RankingContextValue = {
  ranking: Ranking | null
  tiers: Tier[]
}
