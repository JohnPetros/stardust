'use client'

import { useContext, useMemo } from 'react'
import { useAuth } from './useAuth'
import { useCategory } from './useCategory'
import useSWR from 'swr'

import { ChallengesListContext } from '@/contexts/ChallengesListContext'

import { api } from '@/services/api'

import type { Challenge } from '@/types/challenge'

export const useChallengesList = () => {
  const { user } = useAuth()
  const { categories } = useCategory()
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

  async function getFilteredChallenges() {
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

  const { data: challenges, error } = useSWR(
    ['/challenges', state.status, state.difficulty],
    getFilteredChallenges
  )

  function addCategories(challenge: Challenge) {
    if (categories?.length) {
      const challengeCategories = categories.filter((category) =>
        category.challenges_categories.some(
          ({ challenge_id }) => challenge_id === challenge.id
        )
      )
      return { ...challenge, categories: challengeCategories ?? [] }
    }
    return challenge
  }

  const filteredChallenges = useMemo(() => {
    return challenges?.map(addCategories)
  }, [challenges, categories])

  return {
    state,
    dispatch,
    challenges: filteredChallenges ?? [],
    categories: categories ?? [],
  }
}
