'use client'

import { useEffect, useState } from 'react'

import type { Achievement } from '@/@types/Achievement'
import { useAchivementsContext } from '@/contexts/AchievementsContext/hooks/useAchivementsContext'
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
  requiredCount,
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
      const percentage = (currentProgress / requiredCount) * 100
      const barWidth = percentage > 100 ? 100 : percentage
      const canRescue = Boolean(isRescuable)

      const formatedCurrentProgress =
        currentProgress && currentProgress >= requiredCount
          ? requiredCount
          : currentProgress

      setStatus({ barWidth, canRescue, formatedCurrentProgress })
    }
  }, [currentProgress, isRescuable, requiredCount])

  return {
    iconImage,
    status,
    handleRescuButtonClick,
    handleRescuedAchievementsAlertClose,
  }
}
