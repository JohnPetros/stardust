import { useEffect, type RefObject } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useHomeHeader(streakAnimationRef: RefObject<AnimationRef | null>) {
  const { user } = useAuthContext()

  useEffect(() => {
    if (user?.weekStatus.isTodayDone.isFalse && streakAnimationRef.current)
      streakAnimationRef.current.stopAt(0)
  }, [user, streakAnimationRef.current])

  return {
    user,
  }
}
