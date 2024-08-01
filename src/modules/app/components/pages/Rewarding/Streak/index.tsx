'use client'

import { StreakBoard } from '@/modules/global/components/shared/StreakBoard'
import { useStreak } from './useStreak'

type StreakProps = {
  isVisible: boolean
}

export function Streak({ isVisible }: StreakProps) {
  const { user } = useStreak()

  if (!isVisible || !user) return null

  return <StreakBoard weekStatus={user.weekStatus} streakCount={user.streak.value} />
}
