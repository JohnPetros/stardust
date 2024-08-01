'use client'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useEffect, useState } from 'react'

export function useStreak() {
  const { user, updateUser } = useAuthContext()
  const [didUpdateStreak, setDidUpdateStreak] = useState(false)

  useEffect(() => {
    async function updateStreak() {
      if (!user || didUpdateStreak) return
      user.makeTodayStatusDone()
      await updateUser(user)
      setDidUpdateStreak(true)
    }

    updateStreak()
  }, [user, didUpdateStreak, updateUser])

  return {
    user,
  }
}
