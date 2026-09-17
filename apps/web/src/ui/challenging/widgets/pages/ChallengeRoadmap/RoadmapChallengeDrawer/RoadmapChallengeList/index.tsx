import type { RoadmapChallengeDto } from '../../types'
import { RoadmapChallengeListView } from './RoadmapChallengeListView'
export function RoadmapChallengeList(props: {
  challenges: RoadmapChallengeDto[]
  nodeKey: string
  recommendationId?: string
  onOpen: (challenge: RoadmapChallengeDto) => void
}) {
  return <RoadmapChallengeListView {...props} />
}
