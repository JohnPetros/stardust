import { Ranking } from '@/@core/domain/structs'
import type { RankingUserDTO } from '@/@core/dtos'
import { useEffect, useState } from 'react'

export function useRankingProvider(rankingUsers: RankingUserDTO[]) {
  const [ranking, setRanking] = useState<Ranking | null>(null)

  useEffect(() => {
    setRanking(Ranking.create(rankingUsers))
  }, [rankingUsers])

  return {
    ranking,
  }
}
