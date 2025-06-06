import type { AchievementMetricValue } from '@stardust/core/profile/types'

import { useAchievementProgress } from './useAchievementProgress'
import { AchievementProgressView } from './AchievementProgressView'

type AchievementProgressProps = {
  metric: AchievementMetricValue
  requiredCount: number
}

export function AchievementProgress({ metric, requiredCount }: AchievementProgressProps) {
  const progress = useAchievementProgress(metric, requiredCount)
  return <AchievementProgressView progress={progress} requiredCount={requiredCount} />
}
