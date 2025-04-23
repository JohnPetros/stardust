import { useAction } from 'next-safe-action/hooks'
import { useCallback } from 'react'

import { profileActions } from '@/rpc/next-safe-action'

export function useObserveNewUnlockedAchievementsAction(onError: VoidFunction) {
  const { executeAsync } = useAction(profileActions.obsverNewUnlockedAchievements, {
    onError,
  })

  const observe = useCallback(async () => {
    const result = await executeAsync()
    return {
      updatedUserDto: result?.data?.userDto,
      newUnlockedAchievementsDto: result?.data?.newUnlockedAchievementsDto,
    }
  }, [executeAsync])

  return {
    observe,
  }
}
