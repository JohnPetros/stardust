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
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const { data: challengesData, isLoading } = useCache({
    key: 'challenges-page-list',
    dependencies: [debouncedSearch, difficulty, selectedCategories, page, itemsPerPage],
    fetcher: async () =>
      await challengingService.fetchChallengesList({
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        categoriesIds: IdsList.create(selectedCategories),
        completionStatus: ChallengeCompletionStatus.create('any'),
        difficulty: ChallengeDifficulty.create(difficulty),
        upvotesCountOrder: ListingOrder.create('any'),
        postingOrder: ListingOrder.create('desc'),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        shouldIncludeStarChallenges: Logical.create(false),
        title: Text.create(debouncedSearch),
        userId: null,
      }),
  })

  const categories = categoriesData ?? []
  const totalItemsCount = challengesData?.totalItemsCount ?? 0
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage)

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value)
    setPage(1)
  }

  const handleCategoriesChange = (value: string[]) => {
    setSelectedCategories(value)
    setPage(1)
  }

  return {
    challenges: challengesData?.items ?? [],
    isLoading,
    categories,
    filters: {
      search,
      setSearch: handleSearchChange,
      difficulty,
      setDifficulty: handleDifficultyChange,
      selectedCategories,
      setSelectedCategories: handleCategoriesChange,
    },
    pagination: {
      page,
      totalPages,
      totalItemsCount,
      itemsPerPage,
      handleNextPage,
      handlePrevPage,
      handlePageChange,
      handleItemsPerPageChange,
    },
  }
}
