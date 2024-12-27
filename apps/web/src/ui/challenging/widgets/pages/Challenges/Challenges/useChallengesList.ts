'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useQueryParams } from '@/ui/global/hooks/useQueryParams'
import { useCache } from '@/ui/global/hooks/useCache'
import { CACHE, ROUTES } from '@/constants'
import { QUERY_PARAMS } from './query-params'
import {
  ChallengeCompletion,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structs'
import { Challenge, ChallengeCategory } from '@stardust/core/challenging/entities'
import { NextApiClient } from '@/api/next/NextApiClient'
import type { ChallengeCategoryDto, ChallengeDto } from '@stardust/core/challenging/dtos'

type ApiResponse = {
  challenges: ChallengeDto[]
  categories: ChallengeCategoryDto[]
}

export function useChallengesList() {
  const { user } = useAuthContext()
  const querySearchParams = useQueryParams()

  const difficultyLevel = querySearchParams.get(QUERY_PARAMS.difficultyLevel) ?? 'all'
  const completionStatus = querySearchParams.get(QUERY_PARAMS.completitionStatus) ?? 'all'
  const title = querySearchParams.get(QUERY_PARAMS.title) ?? ''
  const categoriesIds = querySearchParams.get(QUERY_PARAMS.categoriesIds) ?? ''

  async function fetchChallengesList() {
    if (!user) return

    const completion = ChallengeCompletion.create(completionStatus)
    const difficulty = ChallengeDifficulty.create(difficultyLevel)

    const apiClient = NextApiClient()
    apiClient.setQueryParam('completionStatus', completion.status)
    apiClient.setQueryParam('difficultyLevel', difficulty.level)
    apiClient.setQueryParam('categoriesIds', categoriesIds)

    const response = await apiClient.get<ApiResponse>(ROUTES.api.challenging.list)
    return response.body
  }

  const { data, error, isLoading } = useCache({
    key: CACHE.keys.challengesList,
    fetcher: fetchChallengesList,
    dependencies: [completionStatus, difficultyLevel, categoriesIds, title, user?.id],
  })

  return {
    challenges: data ? data.challenges.map(Challenge.create) : [],
    categories: data ? data.categories.map(ChallengeCategory.create) : [],
    isLoading,
    error,
  }
}
