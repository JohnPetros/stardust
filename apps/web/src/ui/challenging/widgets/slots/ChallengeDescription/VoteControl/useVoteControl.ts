'use client'

import { useState } from 'react'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Integer } from '@stardust/core/global/structs'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
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
  const { user } = useAuthContext()
  const [initialState, setInitialState] = useState<State>({
    userChallengeVote: challenge?.userVote ?? null,
    upvotesCount: challenge?.upvotesCount.value ?? 0,
    downvotesCount: challenge?.downvotesCount.value ?? 0,
  })
  const { voteChallenge } = useVoteChallengeAction(() => {
    updateChallenge(initialState)
  })

  function updateChallenge(state: State) {
    if (!challenge) return

    challenge.upvotesCount = Integer.create(
      'Contagem de upvotes desse desafio',
      state.upvotesCount,
    )
    challenge.downvotesCount = Integer.create(
      'Contagem de downvotes desse desafio',
      state.downvotesCount,
    )
    challenge.userVote = state.userChallengeVote
    setChallenge(challenge)
    setInitialState(state)
  }

  async function handleVoteButton(userVote: ChallengeVote) {
    if (!user || !challenge) return
    challenge.vote(userVote)
    console.log('upvotesCount', challenge.upvotesCount)
    setChallenge(challenge)

    const { upvotesCount, downvotesCount, userChallengeVote } = await voteChallenge(
      challenge.id,
      userVote,
    )

    updateChallenge({ upvotesCount, downvotesCount, userChallengeVote })
  }

  return {
    challenge,
    upvotesCount: challenge?.upvotesCount.value ?? 0,
    handleVoteButton,
  }
}
