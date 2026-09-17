import type { ChallengeRoadmapDto } from '@stardust/core/challenging/structures/dtos'
import { RoadmapProgressSummaryView } from './RoadmapProgressSummaryView'

type Props = {
  progress: ChallengeRoadmapDto['progress']
  recommendation: ChallengeRoadmapDto['recommendation']
  isAuthenticated: boolean
  onContinue: () => void
}

export function RoadmapProgressSummary(props: Props) {
  return <RoadmapProgressSummaryView {...props} />
}
