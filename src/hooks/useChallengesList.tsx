'use client'

import { useContext, useMemo } from 'react'
import { useAuth } from './useAuth'
import { useCategory } from './useCategory'
import useSWR from 'swr'

import { ChallengesListContext } from '@/contexts/ChallengesListContext'

import { useApi } from '@/services/api'

import type { Challenge } from '@/@types/challenge'

export const useChallengesList = () => {
  const api = useApi()

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
    if (user?.id) {
      const challenges = await api.getFilteredChallenges({
        userId: user.id,
        status: state.status,
        difficulty: state.difficulty,
        categoriesIds: state.categoriesIds,
        search: state.search ?? null,
        range: 0,
      })

      return sortChallengesByDifficulty(challenges)
    }
  }

  async function getUserCompletedChallengesIds() {
    if (user) {
      return await api.getUserCompletedChallengesIds(user.id)
    }
  }

  const {
    data: challenges,
    error,
    isLoading,
  } = useSWR(
    state && user?.id
      ? [
          '/challenges',
          state.status,
          state.difficulty,
          state.categoriesIds,
          state.search,
        ]
      : null,
    getFilteredChallenges
  )

  if (error) {
    throw new Error(error)
  }

  const { data: userCompletedChallengesIds } = useSWR(
    '/user_completed_challenges_ids',
    getUserCompletedChallengesIds
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

  function checkCompletition(challenge: Challenge) {
    if (userCompletedChallengesIds?.length) {
      const is_completed = userCompletedChallengesIds.some(
        (completedChallengeId) => completedChallengeId === challenge.id
      )

      return { ...challenge, is_completed }
    }
    return challenge
  }

  const filteredChallenges = useMemo(() => {
    return challenges?.map(addCategories).map(checkCompletition)
  }, [challenges, categories, userCompletedChallengesIds])

  return {
    state,
    dispatch,
    challenges: filteredChallenges ?? [],
    categories: categories ?? [],
    isLoading,
  }
}
