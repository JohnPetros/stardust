'use client'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { useChallengePage } from './useChallengePage'
import { ChallengePageView } from './ChallengePageView'

type Props = {
  challengeDto: ChallengeDto
  userChallengeVote: string
}

export const ChallengePage = ({ challengeDto, userChallengeVote }: Props) => {
  const {
    challengeTitle,
    panelsLayout,
    shouldHaveConfettiAnimation,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
  } = useChallengePage(challengeDto, userChallengeVote)

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
