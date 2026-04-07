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
        difficulty: ChallengeDifficulty.create('all'),
        upvotesCountOrder: ListingOrder.create('all'),
        downvoteCountOrder: ListingOrder.create('all'),
        completionCountOrder: ListingOrder.create('all'),
        postingOrder: ListingOrder.create('descending'),
        shouldIncludePrivateChallenges: Logical.create(true),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        shouldIncludeStarChallenges: Logical.create(false),
        isNewStatus: ChallengeIsNewStatus.create('all'),
        title: Text.create(''),
        userId: null,
        accountId: null,
        completedChallengesIds: IdsList.create([]),
      }),
  })

  return {
    challenges: data?.items ?? [],
    isLoading,
  }
}
