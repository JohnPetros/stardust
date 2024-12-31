'use client'

import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Integer } from '@stardust/core/global/structs'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useVoteChallengeAction } from './useVoteChallengeAction'

export function useVoteControl() {
  const { getChallengeSlice, getVoteSlice } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()
  const { vote, setVote } = getVoteSlice()
  const { user } = useAuthContext()
  const { voteChallenge } = useVoteChallengeAction()

  async function handleVoteButton(userVote: ChallengeVote) {
    if (!user || !challenge) return

    const { upvotesCount, downvotesCount, userChallengeVote } = await voteChallenge(
      challenge.id,
      userVote,
    )
    challenge.upvotesCount = Integer.create(
      'Contagem de upvotes desse desafio',
      upvotesCount,
    )
    challenge.downvotesCount = Integer.create(
      'Contagem de downvotes desse desafio',
      downvotesCount,
    )
    // setChallenge(challenge)
    setVote(userChallengeVote)
  }

  return {
    vote,
    upvotesCount: challenge?.upvotesCount.value ?? 0,
    handleVoteButton,
  }
}
