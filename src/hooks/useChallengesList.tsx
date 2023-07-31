'use client'

import { useContext } from 'react'
import { useAuth } from './useAuth'
import useSWR from 'swr'

import { ChallengesListContext } from '@/contexts/ChallengesListContext'
import { api } from '@/services/api'
import type { Challenge } from '@/types/challenge'

export const useChallengesList = () => {
  const { user } = useAuth()
  const { state, dispatch } = useContext(ChallengesListContext)

  if (!state) {
    throw new Error(
      'useChallengesList must be used inside ChallengesListProvider'
    )
  }

  function sortChallengesByDifficulty(challenges: Challenge[]) {
    const easyChallenges = challenges.filter(
      (challenge) => challenge.difficulty === 'easy'
    )
    const mediumChallenges = challenges.filter(
      (challenge) => challenge.difficulty === 'medium'
    )
    const hardChallenges = challenges.filter(
      (challenge) => challenge.difficulty === 'hard'
    )

    return easyChallenges.concat(mediumChallenges, hardChallenges)
  }

  async function getChallenges() {
    if (user) {
      const challenges = await api.getFilteredChallenges({
        userId: user?.id,
        status: state.status,
        difficulty: state.difficulty,
        categoriesIds: [],
        range: 0,
      })

      return sortChallengesByDifficulty(challenges)
    }
  }

  console.log(state.status)

  const { data: challenges, error } = useSWR(['/challenges', state.status], getChallenges)

  console.log(error)

  return {
    state,
    dispatch,
    challenges,
  }
}
