import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import {
  ChallengeCompletionStatus,
  ChallengeIsNewStatus,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'
import {
  IdsList,
  ListingOrder,
  Logical,
  OrdinalNumber,
  Text,
} from '@stardust/core/global/structures'

import { CACHE } from '@/constants'
import { useFetch } from '@/ui/global/hooks/useFetch'

export function useRecentChallengesTable(challengingService: ChallengingService) {
  const { data, isLoading } = useFetch({
    key: CACHE.recentChallengesTable.key,
    fetcher: async () =>
      await challengingService.fetchChallengesList({
        page: OrdinalNumber.create(1),
        itemsPerPage: OrdinalNumber.create(10),
        categoriesIds: IdsList.create([]),
        completionStatus: ChallengeCompletionStatus.create('all'),
        difficulty: ChallengeDifficulty.create('any'),
        upvotesCountOrder: ListingOrder.create('any'),
        downvoteCountOrder: ListingOrder.create('any'),
        completionCountOrder: ListingOrder.create('any'),
        postingOrder: ListingOrder.create('desc'),
        shouldIncludePrivateChallenges: Logical.create(true),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        shouldIncludeStarChallenges: Logical.create(false),
        isNewStatus: ChallengeIsNewStatus.create('all'),
        title: Text.create(''),
        userId: null,
      }),
  })

  return {
    challenges: data?.items ?? [],
    isLoading,
  }
}
