import { type RefObject, useEffect } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useTier(
  tierRef: RefObject<HTMLDivElement>,
  tierId: string,
  index: number,
) {
  const { user } = useAuthContext()

  const isFromCurrentTier = user ? user?.tier.id === tierId : false
  const isLocked = user ? index >= user?.tier.position.value : false

  useEffect(() => {
    if (tierRef.current && isFromCurrentTier) {
      setTimeout(() => {
        tierRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'center',
        })
      }, 100)
    }
  }, [tierRef.current, isFromCurrentTier])

  return {
    isFromCurrentTier,
    isLocked,
  }
}
