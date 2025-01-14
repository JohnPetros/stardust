import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { useFetchChallengesListAction } from '@/ui/global/hooks/useFetchChallengesListAction'
import type { ListingOrder } from '../../ListingOrder'
import { Challenge } from '@stardust/core/challenging/entities'

const CHALLENGES_PER_PAGE = 10

export function useChallengesListTab(listingOrder: ListingOrder) {
  const { fetchList } = useFetchChallengesListAction()

  async function fetchChallengesList(page: number) {
    return await fetchList({
      page,
      categoriesIds: '',
      title: '',
      completionStatus: 'all',
      difficultyLevel: 'all',
      postOrder: listingOrder === 'creation-date' ? 'descending' : 'all',
      upvotesOrder: listingOrder === 'upvotes' ? 'descending' : 'all',
      itemsPerPage: CHALLENGES_PER_PAGE,
    })
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.userChallengesList,
    fetcher: fetchChallengesList,
    itemsPerPage: CHALLENGES_PER_PAGE,
    isInfinity: true,
    dependencies: [listingOrder],
  })

  return {
    challenges: data.map(Challenge.create),
    isRecheadedEnd,
    isLoading,
    nextPage,
  }
}
