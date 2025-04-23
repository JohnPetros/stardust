'use client'

import { Challenge } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { QUERY_PARAMS } from '../query-params'
import {
  ChallengeCompletion,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'

import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryArrayParam } from '@/ui/global/hooks/useQueryArrayParam'
import { useFetchChallengesListAction } from './useFetchChallengesListAction'
import { useSleep } from '@/ui/global/hooks/useSleep'

const CHALLENGES_PER_PAGE = 20

export function useChallengesList() {
  const { fetchList } = useFetchChallengesListAction()
  const [difficultyLevel] = useQueryStringParam(QUERY_PARAMS.difficultyLevel, 'all')
  const [completionStatus] = useQueryStringParam(QUERY_PARAMS.completionStatus, 'all')
  const [title] = useQueryStringParam(QUERY_PARAMS.title, '')
  const [categoriesIds] = useQueryArrayParam(QUERY_PARAMS.categoriesIds)
  const { sleep } = useSleep()

  async function fetchChallengesList(page: number) {
    const completion = ChallengeCompletion.create(completionStatus)
    const difficulty = ChallengeDifficulty.create(difficultyLevel)

    await sleep(100)

    return await fetchList({
      page,
      categoriesIds: categoriesIds.join(','),
      completionStatus: completion.status,
      difficultyLevel: difficulty.level,
      itemsPerPage: CHALLENGES_PER_PAGE,
      title,
    })
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.challengesList,
    fetcher: fetchChallengesList,
    itemsPerPage: CHALLENGES_PER_PAGE,
    shouldRefetchOnFocus: false,
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
