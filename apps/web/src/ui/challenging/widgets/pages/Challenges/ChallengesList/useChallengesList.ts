import { Challenge } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { QUERY_PARAMS } from '../query-params'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import {
  IdsList,
  ListingOrder,
  OrdinalNumber,
  Text,
} from '@stardust/core/global/structures'

import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryArrayParam } from '@/ui/global/hooks/useQueryArrayParam'
import { useSleep } from '@/ui/global/hooks/useSleep'

const CHALLENGES_PER_PAGE = 20

export function useChallengesList(challengingService: ChallengingService) {
  const [difficultyLevel] = useQueryStringParam(QUERY_PARAMS.difficultyLevel, 'any')
  const [completionStatus] = useQueryStringParam(QUERY_PARAMS.completionStatus, 'any')
  const [title] = useQueryStringParam(QUERY_PARAMS.title, '')
  const [categoriesIds] = useQueryArrayParam(QUERY_PARAMS.categoriesIds)
  const { sleep } = useSleep()

  async function fetchChallengesList(page: number) {
    await sleep(100)

    const response = await challengingService.fetchChallengesList({
      page: OrdinalNumber.create(page),
      categoriesIds: IdsList.create(categoriesIds),
      completionStatus: ChallengeCompletionStatus.create(completionStatus),
      difficulty: ChallengeDifficulty.create(difficultyLevel),
      itemsPerPage: OrdinalNumber.create(CHALLENGES_PER_PAGE),
      postingOrder: ListingOrder.create('any'),
      upvotesCountOrder: ListingOrder.create('any'),
      title: Text.create(title),
      userId: null,
    })
    if (response.isFailure) response.throwError()

    return response.body
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
