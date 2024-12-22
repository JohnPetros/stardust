import { useEffect, useState } from 'react'

import type { RankingUserDto } from '@stardust/core/ranking/dtos'
import { Ranking } from '@stardust/core/ranking/structs'

export function useRankingProvider(rankingUsers: RankingUserDto[]) {
  const [ranking, setRanking] = useState<Ranking | null>(null)

  useEffect(() => {
    setRanking(Ranking.create(rankingUsers))
  }, [rankingUsers])

  return {
    ranking,
  }
}
