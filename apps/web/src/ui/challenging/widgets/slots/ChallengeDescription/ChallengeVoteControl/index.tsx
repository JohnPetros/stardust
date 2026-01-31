'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengeVoteControlView } from './ChallengeVoteControlView'
import { useChallengeVoteControl } from './useChallengeVoteControl'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

export const ChallengeVoteControl = () => {
  const { challengingService } = useRestContext()
  const { isAccountAuthenticated } = useAuthContext()
  const { challengeVote, upvotesCount, isUserChallengeAuthor, handleVoteButtonClick } =
    useChallengeVoteControl(challengingService)

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
