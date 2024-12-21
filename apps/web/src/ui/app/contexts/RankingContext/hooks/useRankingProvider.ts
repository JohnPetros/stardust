import { Ranking } from '@/@core/domain/structs'
import type { RankingUserDto } from '#dtos'
import { useEffect, useState } from 'react'

export function useRankingProvider(rankingUsers: RankingUserDto[]) {
  const [ranking, setRanking] = useState<Ranking | null>(null)

  useEffect(() => {
    setRanking(Ranking.create(rankingUsers))
  }, [rankingUsers])

  return {
    ranking,
  }
}
