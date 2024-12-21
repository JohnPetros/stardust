'use client'

import { StreakBoard } from '@/ui/global/widgets/components/StreakBoard'
import { StreakIcon } from '@/ui/global/widgets/components/StreakIcon'
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
