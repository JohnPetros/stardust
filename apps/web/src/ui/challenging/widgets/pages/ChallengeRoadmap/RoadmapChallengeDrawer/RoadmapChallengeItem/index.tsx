import type { RoadmapChallengeDto } from '../../types'
import { RoadmapChallengeItemView } from './RoadmapChallengeItemView'
export function RoadmapChallengeItem(props: {
  challenge: RoadmapChallengeDto
  nodeKey: string
  isRecommended: boolean
  onOpen: () => void
}) {
  return <RoadmapChallengeItemView {...props} />
}
