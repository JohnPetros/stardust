'use client'

import { useEffect, useState } from 'react'

import type { WeekStatus } from '@/@types/WeekStatus'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { useDate } from '@/services/date'

export function useStreak() {
  const { user, updateUser } = useAuthContext()

  const [weekStatus, setWeekStatus] = useState<WeekStatus[]>([])
  const [streakAmount, setStreakAmount] = useState(0)
  const toast = useToastContext()
  const date = useDate()

  function updateWeekStatus(
    weekStatus: WeekStatus[],
    dayIndex: number,
    newStatus: WeekStatus
  ) {
    const updatedWeekStatus = weekStatus.map((status, index) =>
      index === dayIndex ? newStatus : status
    )

    setWeekStatus(updatedWeekStatus)
    return updatedWeekStatus
  }

  useEffect(() => {
    async function updateStreak(weekStatus: WeekStatus[]) {
      if (!user) return

      const todayIndex = date.getTodayIndex()
      const todayStatus = weekStatus[todayIndex]

      if (todayStatus !== 'todo') return

      const updatedWeekStatus = updateWeekStatus(weekStatus, todayIndex, 'done')
      const updatedStreak = user.streak + 1

      setStreakAmount(updatedStreak)

      try {
        await updateUser({
          streak: updatedStreak,
          weekStatus: updatedWeekStatus,
          didCompleteSaturday: todayIndex === 6,
        })
      } catch (error) {
        toast.show('Erro ao tentar atualizar o status da sua semana', {
          type: 'error',
        })
      }
    }

    if (user && !weekStatus.length) {
      setWeekStatus(user.weekStatus)
      setStreakAmount(user.streak)

      updateStreak(user.weekStatus)
    }
  }, [user, weekStatus.length, toast, updateUser])

  return {
    weekStatus,
    streakAmount,
  }
}
