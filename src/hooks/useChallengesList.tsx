'use client'

import { useMemo } from 'react'
import useSWR from 'swr'


import type { Challenge } from '@/@types/challenge'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'
import { useChallengesListStore } from '@/stores/challengesListStore'

export  function useChallengesList() {
  const api = useApi()

  const { user } = useAuth()
  const { categoriesIds, difficulty, status, search } = useChallengesListStore(
    (store) => store.state
  )

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
        status: status,
        difficulty: difficulty,
        categoriesIds: categoriesIds,
        search: search ?? null,
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
    () =>
      `/challenges?status=${status}&difficulty=${difficulty}&categoriesIds=${categoriesIds.join(
        ','
      )}&search=${search}&user=${user?.id}`,
    getFilteredChallenges
  )

  console.log(challenges)

  if (error) {
    throw new Error(error)
  }

  const { data: userCompletedChallengesIds } = useSWR(
    () => `/user_completed_challenges_ids?user_id=${user?.id}`,
    getUserCompletedChallengesIds
  )

  const filteredChallenges = useMemo(() => {
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
      if (userCompletedChallengesIds) {
        const isCompleted = userCompletedChallengesIds.includes(challenge.id)

        return { ...challenge, isCompleted }
      }
      return challenge
    }

    if (challenges && categories && userCompletedChallengesIds && !isLoading) {
      return challenges.map(addCategories).map(checkCompletition)
    }
  }, [challenges, categories, userCompletedChallengesIds, isLoading])

  console.log(filteredChallenges)

  return {
    challenges: filteredChallenges ?? [],
    categories: categories ?? [],
    isLoading,
  }
}
