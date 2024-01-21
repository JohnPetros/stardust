'use client'

import { useState } from 'react'

import type { Vote } from '@/@types/vote'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'

export function useVoteButtons() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const userVote = useChallengeStore((store) => store.state.userVote)
  const setUserVote = useChallengeStore((store) => store.actions.setUserVote)

  const [upvotes, setUpvotes] = useState(challenge?.upvotes ?? 0)

  const api = useApi()
  const { user } = useAuth()

  async function handleVoteButton(vote: Vote) {
    if (!user || !challenge) return

    if (vote === userVote) {
      setUserVote(null)
      if (vote === 'upvote') setUpvotes(upvotes - 1)
      await api.removeVotedChallenge(challenge.id, user.id, userVote)
      return
    }

    if (userVote) {
      setUserVote(vote)
      if (vote === 'upvote') setUpvotes(upvotes + 1)
      if (vote === 'downvote') setUpvotes(upvotes - 1)
      await api.updateVotedChallenge(challenge.id, user.id, vote)
      return
    }

    setUserVote(vote)
    setUpvotes(upvotes + 1)
    if (vote === 'upvote') setUpvotes(upvotes + 1)
    await api.addVotedChallenge(challenge.id, user.id, vote)
  }

  return {
    userVote,
    upvotes,
    handleVoteButton,
  }
}