import type { AchievementProgress } from '@stardust/core/profile/structures'

import { AnimatedProgressBar } from '@/ui/global/widgets/components/AnimatedProgressBar'

type Props = {
  progress: AchievementProgress | null
  requiredCount: number
}

export function AchievementProgressView({ progress, requiredCount }: Props) {
  if (progress)
    return (
      <div className='flex w-full items-center gap-2 text-xs text-gray-100'>
        <AnimatedProgressBar height={4} value={Math.floor(progress.percentageProgress)} />
        <span>
          {progress.absoluteProgress}/{requiredCount}
        </span>
      </div>
    )
}
