import { useEffect, useState } from 'react'

import type { AchievementMetricValue } from '@/@core/domain/types'
import { AchievementProgress } from '@/@core/domain/structs'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useAchievementProgress(
  metric: AchievementMetricValue,
  requiredCount: number,
) {
  const { user } = useAuthContext()

  const [progress, setProgress] = useState<AchievementProgress | null>(null)

  useEffect(() => {
    if (!user) return

    const progress = AchievementProgress.create(
      user.getAchievementCount(metric).value,
      requiredCount,
    )

    setProgress(progress)
  }, [user, metric, requiredCount])

  return progress
}
