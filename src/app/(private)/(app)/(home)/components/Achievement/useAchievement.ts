'use client'

import { useEffect, useState } from 'react'

import type { Achievement } from '@/@types/achievement'
import { useAchivementsContext } from '@/contexts/AchievementsContext'
import { useApi } from '@/services/api'

type Status = {
  formatedCurrentProgress: number
  barWidth: number
  canRescue: boolean
}

export function useAchievement({
  icon,
  id,
  reward,
  required_amount,
  currentProgress,
  isRescuable,
}: Achievement) {
  const api = useApi()

  const iconImage = api.getImage('achievements', icon)

  const [status, setStatus] = useState<Status | null>(null)
  const { rescueAchivement, handleRescuedAchievementsAlertClose } =
    useAchivementsContext()

  async function handleRescuButtonClick() {
    await rescueAchivement(id, reward)
  }

  useEffect(() => {
    if (currentProgress || currentProgress === 0) {
      const percentage = (currentProgress / required_amount) * 100
      const barWidth = percentage > 100 ? 100 : percentage
      const canRescue = isRescuable

      const formatedCurrentProgress =
        currentProgress && currentProgress >= required_amount
          ? required_amount
          : currentProgress

      setStatus({ barWidth, canRescue, formatedCurrentProgress })
    }
  }, [currentProgress, isRescuable, required_amount])

  return {
    iconImage,
    status,
    handleRescuButtonClick,
    handleRescuedAchievementsAlertClose,
  }
}
