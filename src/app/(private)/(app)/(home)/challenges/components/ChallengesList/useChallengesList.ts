'use client'

import { useMemo } from 'react'

import { SEARCH_PARAMS } from '../../constants/search-params'
import { isDifficulty } from '../../guards/isDifficulty'
import { isStatus } from '../../guards/isStatus'
import { Difficulty } from '../../types/Difficulty'
import { Status } from '../../types/Status'

import { Category } from '@/@types/Category'
import type { Challenge } from '@/@types/Challenge'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { CACHE } from '@/global/constants/cache'
import { useUrlSearchParams } from '@/global/hooks/useUrlSearchParams'
import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'

export function useChallengesList(categories: Category[]) {
  const api = useApi()

  const { user } = useAuthContext()

  const urlSearchParams = useUrlSearchParams()

  const difficulty = urlSearchParams.get(SEARCH_PARAMS.difficulty) ?? 'all'
  const status = urlSearchParams.get(SEARCH_PARAMS.status) ?? 'all'
  const title = urlSearchParams.get(SEARCH_PARAMS.title) ?? ''
  const categoriesIds = urlSearchParams.get(SEARCH_PARAMS.categoriesIds) ?? []

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
        status: isStatus(status as Status) ? String(status) : '',
        difficulty: isDifficulty(difficulty as Difficulty)
          ? String(difficulty)
          : '',
        categoriesIds: [],
        title,
      })

      const filteredChallenges = challenges.filter(
        (challenge) => challenge.starId === null
      )

      return sortChallengesByDifficulty(filteredChallenges)
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
  } = useCache({
    key: CACHE.keys.challengesList,
    fetcher: getFilteredChallenges,
    dependencies: [status, difficulty, categoriesIds, title, user?.id],
  })

  if (error) {
    throw new Error(error)
  }

  const { data: userCompletedChallengesIds } = useCache({
    key: CACHE.keys.userCompletedChallenges,
    fetcher: getUserCompletedChallengesIds,
    dependencies: [user?.id],
  })

  const filteredChallenges = useMemo(() => {
    function addComplementaryData(challenge: Challenge) {
      function addCategories(challenge: Challenge) {
        if (categories?.length) {
          const challengeCategories = categories.filter((category) =>
            category.challengesIds.includes(challenge.id)
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

      return checkCompletition(addCategories(challenge))
    }

    if (challenges && categories && userCompletedChallengesIds && !isLoading) {
      return challenges.map(addComplementaryData)
    }
  }, [challenges, categories, userCompletedChallengesIds, isLoading])

  return {
    challenges: filteredChallenges ?? [],
    categories: categories ?? [],
    isLoading,
  }
}
