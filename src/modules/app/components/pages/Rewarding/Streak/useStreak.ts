'use client'

import { useEffect, useState } from 'react'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'

export function useStreak() {
  const { user, updateUser } = useAuthContext()
  const [isStreakBoardVisible, setIsStreakBoardVisible] = useState(false)

  useEffect(() => {
    async function updateStreak() {
      if (!user || isStreakBoardVisible) return
      user.makeTodayStatusDone()
      await updateUser(user)
      setIsStreakBoardVisible(true)
    }

    updateStreak()
  }, [user, isStreakBoardVisible, updateUser])

  return {
    user,
    isStreakBoardVisible,
  }
}
