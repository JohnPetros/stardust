import { useEffect, useState } from 'react'

import { AchievementProgress, type Integer } from '@/@core/domain/structs'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'

export function useAchievementProgress(
  metric: AchievementMetricValue,
  requiredCount: number
) {
  const { user } = useAuthContext()

  const [progress, setProgress] = useState<AchievementProgress | null>(null)

  useEffect(() => {
    if (!user) return

    const progress = AchievementProgress.create(
      user.getAchievementCount(metric).value,
      requiredCount
    )

    setProgress(progress)
  }, [user, metric, requiredCount])

  return progress
}
