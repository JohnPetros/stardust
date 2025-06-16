import { useState } from 'react'

import { Integer } from '@stardust/core/global/structures'
import { ChallengeVote } from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type State = {
  userChallengeVote: ChallengeVote
  upvotesCount: number
  downvotesCount: number
}

export function useChallengeVoteControl(challengingService: ChallengingService) {
  const { user } = useAuthContext()
  const { getChallengeSlice } = useChallengeStore()
  const toast = useToastContext()
  const { challenge, setChallenge } = getChallengeSlice()
  const [initialState, setInitialState] = useState<State>({
    userChallengeVote: ChallengeVote.createAsNone(),
    upvotesCount: challenge?.upvotesCount.value ?? 0,
    downvotesCount: challenge?.downvotesCount.value ?? 0,
  })

  function updateState(state: State) {
    if (!challenge) return

    challenge.upvotesCount = Integer.create(state.upvotesCount)
    challenge.downvotesCount = Integer.create(state.downvotesCount)
    challenge.userVote = state.userChallengeVote
    setChallenge(challenge)
    setInitialState(state)
  }

  async function executeVoteChallengeAction(userVote: ChallengeVote) {
    if (!challenge) return

    const response = await challengingService.voteChallenge(challenge.id, userVote)

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      updateState(initialState)
    }

    if (response.isSuccessful) {
      updateState({
        upvotesCount: challenge.upvotesCount.value,
        downvotesCount: challenge.downvotesCount.value,
        userChallengeVote: ChallengeVote.create(response.body.userChallengeVote),
      })
    }
  }

  async function handleVoteButtonClick(userVote: string) {
    if (!challenge) return
    challenge.vote(ChallengeVote.create(userVote))
    setChallenge(challenge)
    await executeVoteChallengeAction(ChallengeVote.create(userVote))
  }

  return {
    challengeVote: challenge?.userVote,
    upvotesCount: challenge?.upvotesCount.value ?? 0,
    isUserChallengeAuthor:
      challenge && user ? challenge?.author.isEqualTo(user).isTrue : false,
    handleVoteButtonClick,
  }
}
