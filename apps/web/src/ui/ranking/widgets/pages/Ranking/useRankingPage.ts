import { useEffect, useState } from 'react'

import type { RankingUserDto, RankingWinnerDto, TierDto, UserDto } from '#dtos'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Ranking } from '@/@core/domain/structs'

export function useRankingPage(
  rankingUsers: RankingUserDto[],
  lastWeekRankingWinners: RankingUserDto[],
) {
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const [lastWeekWinners, setLastWeekWinners] =
    useState<RankingUserDto[]>(lastWeekRankingWinners)

  function hadleResultHide() {
    setLastWeekWinners([])
  }

  useEffect(() => {
    setRanking(Ranking.create(rankingUsers))
  }, [rankingUsers])

  return {
    ranking,
    lastWeekWinners,
    hadleResultHide,
  }
}
