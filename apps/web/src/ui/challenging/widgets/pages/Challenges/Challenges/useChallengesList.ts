'use client'

import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { PaginationResponse } from '@stardust/core/responses'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useQueryParams } from '@/ui/global/hooks/useQueryParams'
import { CACHE, ROUTES } from '@/constants'
import { QUERY_PARAMS } from './query-params'
import {
  ChallengeCompletion,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structs'
import { NextApiClient } from '@/api/next/NextApiClient'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const CHALLENGES_PER_PAGE = 10

export function useChallengesList() {
  const { user } = useAuthContext()
  const querySearchParams = useQueryParams()

  const difficultyLevel = querySearchParams.get(QUERY_PARAMS.difficultyLevel) ?? 'all'
  const completionStatus = querySearchParams.get(QUERY_PARAMS.completitionStatus) ?? 'all'
  const title = querySearchParams.get(QUERY_PARAMS.title) ?? ''
  const categoriesIds = querySearchParams.get(QUERY_PARAMS.categoriesIds) ?? ''

  async function fetchChallengesList(page: number) {
    const completion = ChallengeCompletion.create(completionStatus)
    const difficulty = ChallengeDifficulty.create(difficultyLevel)

    const apiClient = NextApiClient()
    apiClient.setQueryParam('page', page.toString())
    apiClient.setQueryParam('itemsPerPage', CHALLENGES_PER_PAGE.toString())
    apiClient.setQueryParam('completionStatus', completion.status)
    apiClient.setQueryParam('difficultyLevel', difficulty.level)
    if (title) apiClient.setQueryParam('title', title)
    if (categoriesIds) apiClient.setQueryParam('categoriesIds', categoriesIds)

    const response = await apiClient.get<PaginationResponse<ChallengeDto>>(
      ROUTES.api.challenging.list,
    )
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading } = usePaginatedCache({
    key: CACHE.keys.challengesList,
    fetcher: fetchChallengesList,
    itemsPerPage: CHALLENGES_PER_PAGE,
    isInfinity: true,
    dependencies: [completionStatus, difficultyLevel, categoriesIds, title, user?.id],
  })

  return {
    challenges: data.map(Challenge.create),
    isLoading,
  }
}
