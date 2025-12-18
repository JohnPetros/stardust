import { useState, useMemo, useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'
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

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const ITEMS_PER_PAGE = OrdinalNumber.create(10)

export function useChallengesPage(challengingService: ChallengingService) {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebounceValue(searchInput, 500)
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(
    ChallengeDifficulty.create('any'),
  )
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [categories, setCategories] = useState<ChallengeCategoryDto[]>([])

  const search = useMemo(() => {
    return debouncedSearch ? Text.create(debouncedSearch) : Text.create('')
  }, [debouncedSearch])

  const categoriesIds = useMemo(() => {
    return IdsList.create(selectedCategoryIds)
  }, [selectedCategoryIds])

  useEffect(() => {
    async function loadCategories() {
      const response = await challengingService.fetchAllChallengeCategories()
      if (response.isSuccessful && response.body) {
        setCategories(response.body)
      }
    }
    loadCategories()
  }, [])

  const {
    data: challengesData,
    isFetching,
    totalItemsCount,
  } = usePaginatedCache({
    key: CACHE.recentChallengesTable.key,
    fetcher: async () =>
      await challengingService.fetchAllChallenges({
        page: OrdinalNumber.create(page),
        itemsPerPage: ITEMS_PER_PAGE,
        categoriesIds,
        completionStatus: ChallengeCompletionStatus.create('any'),
        difficulty,
        upvotesCountOrder: ListingOrder.create('any'),
        postingOrder: ListingOrder.create('desc'),
        title: search,
        shouldIncludeStarChallenges: Logical.create(true),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        userId: null,
      }),
    dependencies: [
      debouncedSearch,
      difficulty.level,
      selectedCategoryIds.join(','),
      page,
    ],
    itemsPerPage: ITEMS_PER_PAGE.value,
  })

  const challenges = challengesData ?? []
  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE.value)

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPage(1)
  }

  function handleDifficultyChange(value: string) {
    setDifficulty(ChallengeDifficulty.create(value))
    setPage(1)
  }

  function handleCategoriesChange(categoryIds: string[]) {
    setSelectedCategoryIds(categoryIds)
    setPage(1)
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return {
    challenges,
    isLoading: isFetching,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage: ITEMS_PER_PAGE.value,
    searchInput,
    difficulty,
    selectedCategoryIds,
    categories,
    handleSearchChange,
    handleDifficultyChange,
    handleCategoriesChange,
    handlePrevPage,
    handleNextPage,
  }
}
