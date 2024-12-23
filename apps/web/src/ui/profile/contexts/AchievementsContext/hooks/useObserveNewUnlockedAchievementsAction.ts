import { useAction } from 'next-safe-action/hooks'
import { profileActions } from '@/server/next-safe-action'

export function useObserveNewUnlockedAchievementsAction(onError: VoidFunction) {
  const { executeAsync } = useAction(profileActions.obsverNewUnlockedAchievements, {
    onError,
  })

  async function observe() {
    const result = await executeAsync()
    return {
      updatedUserDto: result?.data?.userDto,
      newUnlockedAchievementsDto: result?.data?.newUnlockedAchievementsDto,
    }
  }

  return {
    observe,
  }
}
