import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { Challenge } from '@stardust/core/challenging/entities'
import type { TabListSorter } from '../../TabListSorter'
import {
  IdsList,
  Text,
  ListingOrder,
  OrdinalNumber,
  Id,
} from '@stardust/core/global/structures'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'

const CHALLENGES_PER_PAGE = OrdinalNumber.create(10)

export function useChallengesListTab(
  service: ChallengingService,
  tabListSorter: TabListSorter,
  userId: string,
) {
  async function fetchChallengesList(page: number) {
    const response = await service.fetchChallengesList({
      page: OrdinalNumber.create(page),
      itemsPerPage: CHALLENGES_PER_PAGE,
      title: Text.create(''),
      categoriesIds: IdsList.create([]),
      difficulty: ChallengeDifficulty.create('any'),
      completionStatus: ChallengeCompletionStatus.create('any'),
      upvotesCountOrder: ListingOrder.create(
        tabListSorter === 'date' ? 'descending' : 'any',
      ),
      postingOrder: ListingOrder.create(
        tabListSorter === 'upvotesCount' ? 'descending' : 'any',
      ),
      userId: Id.create(userId),
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.userChallengesList,
    fetcher: fetchChallengesList,
    itemsPerPage: CHALLENGES_PER_PAGE.value,
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
