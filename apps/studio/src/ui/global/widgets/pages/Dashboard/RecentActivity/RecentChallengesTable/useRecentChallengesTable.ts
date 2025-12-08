import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'
import {
  IdsList,
  ListingOrder,
  OrdinalNumber,
  Text,
} from '@stardust/core/global/structures'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useRecentChallengesTable(challengingService: ChallengingService) {
  const { data, isLoading } = useCache({
    key: CACHE.recentChallengesTable.key,
    fetcher: async () =>
      await challengingService.fetchChallengesList({
        page: OrdinalNumber.create(1),
        itemsPerPage: OrdinalNumber.create(10),
        categoriesIds: IdsList.create([]),
        completionStatus: ChallengeCompletionStatus.create('any'),
        difficulty: ChallengeDifficulty.create('any'),
        upvotesCountOrder: ListingOrder.create('any'),
        postingOrder: ListingOrder.create('desc'),
        title: Text.create(''),
        userId: null,
      }),
  })

  console.log(data)

  return {
    challenges: data?.items ?? [],
    isLoading,
  }
}
