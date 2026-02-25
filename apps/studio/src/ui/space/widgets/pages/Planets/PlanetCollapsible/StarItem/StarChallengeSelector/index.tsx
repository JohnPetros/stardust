import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { Id } from '@stardust/core/global/structures'

import { StarChallengeSelectorView } from './StarChallengeSelectorView'
import { useStarChallengeSelector } from './useStarChallengeSelector'

type Props = {
  starId: Id
  isStarChallenge: boolean
  selectedChallengeId: string
  selectedChallengeTitle: string
  challengingService: ChallengingService
  toastProvider: ToastProvider
  onChallengeLinked?: (challengeId: string) => Promise<void> | void
  onChallengeUnlinked?: () => Promise<void> | void
}

export const StarChallengeSelector = ({
  starId,
  isStarChallenge,
  selectedChallengeId,
  selectedChallengeTitle,
  challengingService,
  toastProvider,
  onChallengeLinked,
  onChallengeUnlinked,
}: Props) => {
  const hookProps = useStarChallengeSelector({
    starId,
    challengingService,
    toastProvider,
    onChallengeLinked,
  })

  if (!isStarChallenge) {
    return null
  }

  return (
    <StarChallengeSelectorView
      {...hookProps}
      selectedChallengeId={selectedChallengeId}
      selectedChallengeTitle={selectedChallengeTitle}
      onChallengeUnlinked={onChallengeUnlinked}
    />
  )
}
