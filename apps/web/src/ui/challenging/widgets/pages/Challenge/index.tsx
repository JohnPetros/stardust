'use client'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { useChallengePage } from './useChallengePage'
import { ChallengePageView } from './ChallengePageView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

type Props = {
  challengeDto: ChallengeDto
  userChallengeVote: string
}

export const ChallengePage = ({ challengeDto, userChallengeVote }: Props) => {
  const { user, isAccountAuthenticated } = useAuthContext()
  const {
    challengeTitle,
    panelsLayout,
    shouldHaveConfettiAnimation,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
  } = useChallengePage({ challengeDto, user, userChallengeVote, isAccountAuthenticated })

  return (
    <ChallengePageView
      challengeTitle={challengeTitle}
      panelsLayout={panelsLayout}
      shouldHaveConfettiAnimation={shouldHaveConfettiAnimation}
      handleBackButtonClick={handleBackButtonClick}
      handlePanelsLayoutButtonClick={handlePanelsLayoutButtonClick}
    />
  )
}
