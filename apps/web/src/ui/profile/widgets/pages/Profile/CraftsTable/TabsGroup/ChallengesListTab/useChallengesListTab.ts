import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { Challenge } from '@stardust/core/challenging/entities'
import type { TabListSorter } from '../../TabListSorter'
import { useApi } from '@/ui/global/hooks/useApi'

const CHALLENGES_PER_PAGE = 10

export function useChallengesListTab(tabListSorter: TabListSorter, userId: string) {
  const api = useApi()

  async function fetchChallengesList(page: number) {
    const response = await api.fetchChallengesList({
      page,
      title: '',
      itemsPerPage: CHALLENGES_PER_PAGE,
      categoriesIds: [],
      difficultyLevel: 'all',
      upvotesCountOrder: tabListSorter === 'date' ? 'descending' : 'all',
      postOrder: tabListSorter === 'upvotesCount' ? 'descending' : 'all',
      userId,
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.userChallengesList,
    fetcher: fetchChallengesList,
    itemsPerPage: CHALLENGES_PER_PAGE,
    isInfinity: true,
    shouldRefetchOnFocus: false,
    dependencies: [tabListSorter],
  })

  return {
    challenges: data.map(Challenge.create),
    isRecheadedEnd,
    isLoading,
    nextPage,
  }
}
