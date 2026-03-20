'use client'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { useChallengePage } from './useChallengePage'
import { ChallengePageView } from './ChallengePageView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

type Props = {
  challengeDto: ChallengeDto
  userChallengeVote: string
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
}

export const ChallengePage = ({
  challengeDto,
  userChallengeVote,
  previousChallengeSlug,
  nextChallengeSlug,
}: Props) => {
  const { user, isAccountAuthenticated } = useAuthContext()
  const {
    challengeTitle,
    panelsLayout,
    shouldHaveConfettiAnimation,
    challengeNavigationSlot,
    challengeNavigationAlertDialogSlot,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
  } = useChallengePage({
    challengeDto,
    user,
    userChallengeVote,
    previousChallengeSlug,
    nextChallengeSlug,
    isAccountAuthenticated,
  })

  return (
    <ChallengePageView
      challengeTitle={challengeTitle}
      panelsLayout={panelsLayout}
      shouldHaveConfettiAnimation={shouldHaveConfettiAnimation}
      challengeNavigationSlot={challengeNavigationSlot}
      challengeNavigationAlertDialogSlot={challengeNavigationAlertDialogSlot}
      handleBackButtonClick={handleBackButtonClick}
      handlePanelsLayoutButtonClick={handlePanelsLayoutButtonClick}
    />
  )
}
