'use client'

import { useState } from 'react'

import type { Vote } from '@/@types/Vote'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'

export function useVoteButtons() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const userVote = useChallengeStore((store) => store.state.userVote)
  const setUserVote = useChallengeStore((store) => store.actions.setUserVote)

  const [upvotes, setUpvotes] = useState(challenge?.upvotesCount ?? 0)

  const api = useApi()
  const { user } = useAuthContext()

  async function handleVoteButton(vote: Vote) {
    if (!user || !challenge) return

    if (userVote && vote === userVote) {
      if (vote === 'upvote') setUpvotes(upvotes - 1)
      setUserVote(null)
      await api.removeVotedChallenge(challenge.id, user.id, userVote)
      return
    }

    if (userVote && vote !== userVote) {
      if (vote === 'upvote') setUpvotes(upvotes + 1)
      if (vote === 'downvote' && upvotes !== 0) setUpvotes(upvotes - 1)
      setUserVote(vote)
      await api.updateVotedChallenge(challenge.id, user.id, vote)
      return
    }

    if (!userVote) {
      setUserVote(vote)
      if (vote === 'upvote') setUpvotes(upvotes + 1)
      await api.addVotedChallenge(challenge.id, user.id, vote)
    }
  }

  return {
    userVote,
    upvotes,
    handleVoteButton,
  }
}
