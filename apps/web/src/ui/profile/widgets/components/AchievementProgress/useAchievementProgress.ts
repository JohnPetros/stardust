import { useEffect, useState } from 'react'

import type { AchievementMetricValue } from '@stardust/core/profile/types'
import { AchievementProgress } from '@stardust/core/profile/structures'

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
