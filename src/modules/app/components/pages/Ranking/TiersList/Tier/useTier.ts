import { type RefObject, useEffect } from 'react'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'

export function useTier(
  tierRef: RefObject<HTMLDivElement>,
  rankingId: string,
  index: number
) {
  const { user } = useAuthContext()

  const isFromCurrentRanking = user ? user?.ranking.id === rankingId : false
  const isLocked = user ? index >= user?.ranking.position.value : false

  useEffect(() => {
    if (tierRef.current && isFromCurrentRanking) {
      setTimeout(() => {
        tierRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'center',
        })
      }, 100)
    }
  }, [tierRef.current, isFromCurrentRanking])

  return {
    isFromCurrentRanking,
    isLocked,
  }
}
