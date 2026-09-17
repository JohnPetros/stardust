import type { RoadmapChallengeDto } from '../../types'
import { RoadmapChallengeItem } from '../RoadmapChallengeItem'

type Props = {
  challenges: RoadmapChallengeDto[]
  nodeKey: string
  recommendationId?: string
  onOpen: (challenge: RoadmapChallengeDto) => void
}
export function RoadmapChallengeListView({
  challenges,
  nodeKey,
  recommendationId,
  onOpen,
}: Props) {
  if (challenges.length === 0)
    return (
      <p
        role='status'
        aria-live='polite'
        className='py-8 text-center text-sm text-gray-400'
      >
        Nenhum desafio corresponde aos filtros.
      </p>
    )
  return (
    <ul aria-label='Desafios da categoria'>
      {challenges.map((challenge) => (
        <RoadmapChallengeItem
          key={challenge.id ?? challenge.slug}
          challenge={challenge}
          nodeKey={nodeKey}
          isRecommended={challenge.id === recommendationId}
          onOpen={() => onOpen(challenge)}
        />
      ))}
    </ul>
  )
}
