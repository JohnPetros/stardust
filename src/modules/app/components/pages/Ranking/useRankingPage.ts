import { useEffect, useState } from 'react'

import type { RankingWinnerDTO, UserDTO } from '@/@core/dtos'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'

export function useRankingPage(user: UserDTO, rankingWinners: RankingWinnerDTO[]) {
  const { mutateUserCache } = useAuthContext()
  const [winners, setWinners] = useState<RankingWinnerDTO[]>(rankingWinners)

  function handleHideWinners() {
    setWinners([])
  }

  // useEffect(() => {
  //   mutateUserCache(user)
  // }, [user, mutateUserCache])

  return {
    rankingWinners,
    winners,
    handleHideWinners,
  }
}
