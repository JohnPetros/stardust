'use client'

import { useEffect, useRef, useState } from 'react'

import { StreakBoard } from '../../../(home)/profile/components/StreakBoard'

import type { WeekStatus } from '@/@types/weekStatus'
import { Toast, ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/contexts/AuthContext'

export function Streak() {
  const { user, updateUser } = useAuth()

  const [weekStatus, setWeekStatus] = useState<WeekStatus[]>([])
  const [streakAmount, setStreakAmount] = useState(0)
  const toastRef = useRef<ToastRef>(null)

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

  async function updateStreak(weekStatus: WeekStatus[]) {
    if (!user) return

    const todayIndex = new Date().getDay()
    const todayStatus = weekStatus[todayIndex]

    if (todayStatus !== 'todo') return

    const updatedWeekStatus = updateWeekStatus(weekStatus, todayIndex, 'done')
    const updatedStreak = user.streak + 1

    setStreakAmount(updatedStreak)

    const error = await updateUser({
      streak: updatedStreak,
      week_status: updatedWeekStatus,
      did_complete_saturday: todayIndex === 6,
    })

    if (error) {
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao tentar atualizar o status da sua semana',
      })
    }
  }

  useEffect(() => {
    if (user) {
      setWeekStatus(user.week_status)
      setStreakAmount(user.streak)

      updateStreak(user.week_status)
    }
  }, [])

  return (
    <>
      <Toast ref={toastRef} />
      <StreakBoard weekStatus={weekStatus} streakAmount={streakAmount} />
    </>
  )
}
