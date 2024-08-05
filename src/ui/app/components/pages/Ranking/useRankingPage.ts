import { useEffect, useState } from 'react'

import type { RankingUserDTO, RankingWinnerDTO, TierDTO, UserDTO } from '@/@core/dtos'
import { useAuthContext } from '@/ui/global/contexts/AuthContext'
import { Ranking } from '@/@core/domain/structs'

export function useRankingPage(
  rankingUsers: RankingUserDTO[],
  lastWeekRankingWinners: RankingUserDTO[]
) {
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const [lastWeekWinners, setLastWeekWinners] =
    useState<RankingUserDTO[]>(lastWeekRankingWinners)

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
