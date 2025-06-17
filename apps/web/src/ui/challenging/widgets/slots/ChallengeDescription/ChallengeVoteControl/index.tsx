'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { ChallengeVoteControlView } from './ChallengeVoteControlView'
import { useChallengeVoteControl } from './useChallengeVoteControl'

export const ChallengeVoteControl = () => {
  const { challengingService } = useRest()
  const { challengeVote, upvotesCount, isUserChallengeAuthor, handleVoteButtonClick } =
    useChallengeVoteControl(challengingService)

  if (challengeVote)
    return (
      <ChallengeVoteControlView
        challengeVote={challengeVote}
        upvotesCount={upvotesCount}
        isUserChallengeAuthor={isUserChallengeAuthor}
        handleVoteButtonClick={handleVoteButtonClick}
      />
    )
}
