'use client'

import { useStreak } from './useStreak'

import { StreakBoard } from '@/app/components/StreakBoard'

type StreakProps = {
  isVisible: boolean
}

export function Streak({ isVisible }: StreakProps) {
  const { streakAmount, weekStatus } = useStreak()

  return isVisible ? (
    <StreakBoard weekStatus={weekStatus} streakAmount={streakAmount} />
  ) : null
}
