'use client'

import { StreakBoard } from '@/ui/global/components/shared/StreakBoard'
import { StreakIcon } from '@/ui/global/components/shared/StreakIcon'
import { useStreak } from './useStreak'

export function Streak() {
  const { user, isStreakBoardVisible } = useStreak()

  if (!user || !isStreakBoardVisible) return null

  return (
    <>
      <StreakIcon size={220} />
      <StreakBoard weekStatus={user.weekStatus} streakCount={user.streak.value} />
    </>
  )
}
