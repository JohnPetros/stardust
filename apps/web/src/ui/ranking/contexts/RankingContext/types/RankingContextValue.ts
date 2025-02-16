import type { Tier } from '@stardust/core/ranking/entities'
import type { Ranking } from '@stardust/core/ranking/structs'

export type RankingContextValue = {
  ranking: Ranking | null
  tiers: Tier[]
}
