'use client'

import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { PaginationResponse } from '@stardust/core/responses'

import { CACHE, ROUTES } from '@/constants'
import { QUERY_PARAMS } from '../query-params'
import {
  ChallengeCompletion,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structs'
import { NextApiClient } from '@/api/next/NextApiClient'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryArrayParam } from '@/ui/global/hooks/useQueryArrayParam'

const CHALLENGES_PER_PAGE = 10

export function useChallengesList() {
  const [difficultyLevel] = useQueryStringParam(QUERY_PARAMS.difficultyLevel, 'all')
  const [completionStatus] = useQueryStringParam(QUERY_PARAMS.completionStatus, 'all')
  const [title] = useQueryStringParam(QUERY_PARAMS.title)
  const [categoriesIds] = useQueryArrayParam(QUERY_PARAMS.categoriesIds)

  async function fetchChallengesList(page: number) {
    const completion = ChallengeCompletion.create(completionStatus)
    const difficulty = ChallengeDifficulty.create(difficultyLevel)

    const apiClient = NextApiClient()
    apiClient.setQueryParam('page', page.toString())
    apiClient.setQueryParam('itemsPerPage', CHALLENGES_PER_PAGE.toString())
    apiClient.setQueryParam('completionStatus', completion.status)
    apiClient.setQueryParam('difficultyLevel', difficulty.level)
    if (title) apiClient.setQueryParam('title', title)
    if (categoriesIds) apiClient.setQueryParam('categoriesIds', categoriesIds.join(','))

    const response = await apiClient.get<PaginationResponse<ChallengeDto>>(
      ROUTES.api.challenging.list,
    )
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.challengesList,
    fetcher: fetchChallengesList,
    itemsPerPage: CHALLENGES_PER_PAGE,
    isInfinity: true,
    dependencies: [completionStatus, difficultyLevel, categoriesIds, title],
  })

  function handleShowMore() {
    nextPage()
  }

  return {
    challenges: data.map(Challenge.create),
    isLoading,
    isRecheadedEnd,
    handleShowMore,
  }
}
