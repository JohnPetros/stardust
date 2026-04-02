'use client'

import { ChallengeVoteControlView } from './ChallengeVoteControlView'
import { useChallengeVoteControl } from './useChallengeVoteControl'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useChallengeDescriptionActions } from '../useChallengeDescriptionActions'

export const ChallengeVoteControl = () => {
  const { voteChallenge: onVoteChallenge } = useChallengeDescriptionActions()
  const { isAccountAuthenticated } = useAuthContext()
  const { challengeVote, upvotesCount, isUserChallengeAuthor, handleVoteButtonClick } =
    useChallengeVoteControl(onVoteChallenge)

  if (challengeVote)
    return (
      <ChallengeVoteControlView
        isAccountAuthenticated={isAccountAuthenticated}
        challengeVote={challengeVote}
        upvotesCount={upvotesCount}
        isUserChallengeAuthor={isUserChallengeAuthor}
        handleVoteButtonClick={handleVoteButtonClick}
      />
    )
}
