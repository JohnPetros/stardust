import { useState } from 'react'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'
import {
  IdsList,
  ListingOrder,
  Logical,
  OrdinalNumber,
  Text,
} from '@stardust/core/global/structures'

import { useCache } from '@/ui/global/hooks/useCache'
import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { useRest } from '@/ui/global/hooks/useRest'

export function useChallengesPage() {
  const { challengingService } = useRest()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [difficulty, setDifficulty] = useState('any')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { data: categoriesData } = useCache({
    key: 'challenge-categories',
    fetcher: () => challengingService.fetchAllChallengeCategories(),
  })

  const { data: challengesData, isLoading } = useCache({
    key: 'challenges-page-list',
    dependencies: [debouncedSearch, difficulty, selectedCategories],
    fetcher: async () =>
      await challengingService.fetchChallengesList({
        page: OrdinalNumber.create(1),
        itemsPerPage: OrdinalNumber.create(5),
        categoriesIds: IdsList.create(selectedCategories),
        completionStatus: ChallengeCompletionStatus.create('any'),
        difficulty: ChallengeDifficulty.create(difficulty),
        upvotesCountOrder: ListingOrder.create('any'),
        postingOrder: ListingOrder.create('desc'),
        title: Text.create(debouncedSearch),
        shouldIncludeStarChallenges: Logical.create(false),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        userId: null,
      }),
  })

  const categories = categoriesData ?? []

  return {
    challenges: challengesData?.items ?? [],
    isLoading,
    categories,
    filters: {
      search,
      setSearch,
      difficulty,
      setDifficulty,
      selectedCategories,
      setSelectedCategories,
    },
  }
}
