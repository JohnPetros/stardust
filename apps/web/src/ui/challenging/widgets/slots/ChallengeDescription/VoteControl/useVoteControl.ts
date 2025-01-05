'use client'

import { useState } from 'react'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Integer } from '@stardust/core/global/structs'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useVoteChallengeAction } from './useVoteChallengeAction'

type State = {
  userChallengeVote: ChallengeVote
  upvotesCount: number
  downvotesCount: number
}

export function useVoteControl() {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()
  const [initialState, setInitialState] = useState<State>({
    userChallengeVote: challenge?.userVote ?? null,
    upvotesCount: challenge?.upvotesCount.value ?? 0,
    downvotesCount: challenge?.downvotesCount.value ?? 0,
  })
  const { voteChallenge } = useVoteChallengeAction({
    onError: () => {
      updateChallenge(initialState)
    },
  })

  function updateChallenge(state: State) {
    if (!challenge) return

    challenge.upvotesCount = Integer.create(state.upvotesCount)
    challenge.downvotesCount = Integer.create(state.downvotesCount)
    challenge.userVote = state.userChallengeVote
    setChallenge(challenge)
    setInitialState(state)
  }

  async function executeVoteChallengeAction(userVote: ChallengeVote) {
    if (!challenge) return
    const { upvotesCount, downvotesCount, userChallengeVote } = await voteChallenge(
      challenge.id,
      userVote,
    )

    updateChallenge({ upvotesCount, downvotesCount, userChallengeVote })
  }

  async function handleVoteButton(userVote: ChallengeVote) {
    if (!challenge) return
    challenge.vote(userVote)
    setChallenge(challenge)
    await executeVoteChallengeAction(userVote)
  }

  return {
    challenge,
    upvotesCount: challenge?.upvotesCount.value ?? 0,
    handleVoteButton,
  }
}
