import type { Star } from '@stardust/core/space/entities'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { StarChallengeSelector } from './StarChallengeSelector'
import { StarItemView } from './StarItemView'
import { useStarItem } from './useStarItem'

type Props = {
  star: Star
  onDelete: (starId: string) => void
}

export const StarItem = ({ star, onDelete }: Props) => {
  const { spaceService, challengingService } = useRestContext()
  const toastProvider = useToastProvider()
  const navigationProvider = useNavigationProvider()

  const {
    isChallenge,
    handleStarNameChange,
    handleStarAvailabilityChange,
    handleStarTypeChange,
    selectedChallengeId,
    selectedChallengeTitle,
    handleChallengeLinking,
    handleChallengeUnlink,
    handleChallengeClick,
  } = useStarItem({
    service: spaceService,
    challengingService,
    toastProvider,
    navigationProvider,
    starId: star.id,
    isStarChallenge: star.isChallenge,
  })

  return (
    <StarItemView
      star={star}
      isChallenge={isChallenge.value}
      onNameChange={handleStarNameChange}
      onAvailabilityChange={handleStarAvailabilityChange}
      onTypeChange={handleStarTypeChange}
      onChallengeClick={handleChallengeClick}
      challengeSelector={
        <StarChallengeSelector
          starId={star.id}
          isStarChallenge={isChallenge.value}
          selectedChallengeId={selectedChallengeId}
          selectedChallengeTitle={selectedChallengeTitle}
          challengingService={challengingService}
          toastProvider={toastProvider}
          onChallengeLinked={handleChallengeLinking}
          onChallengeUnlinked={handleChallengeUnlink}
        />
      }
      onDelete={onDelete}
    />
  )
}
