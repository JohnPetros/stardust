import { useMemo } from 'react'
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
import type { ChallengingService } from '@stardust/core/challenging/interfaces'

import { useCache } from '@/ui/global/hooks/useCache'
import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryNumberParam } from '@/ui/global/hooks/useQueryNumberParam'
import { useQueryStringArrayParam } from '@/ui/global/hooks/useQueryStringArrayParam'

type Params = {
  service: ChallengingService
}

export function useChallengesPage({ service }: Params) {
  const [search, setSearch] = useQueryStringParam('q', '')
  const debouncedSearch = useDebounce(search, 500)
  const [difficulty, setDifficulty] = useQueryStringParam('difficulty', 'any')
  const [visibility, setVisibility] = useQueryStringParam('visibility', 'all')
  const [selectedCategories, setSelectedCategories] = useQueryStringArrayParam(
    'categories',
    [],
  )
  const [upvotesCountOrder, setUpvotesCountOrder] = useQueryStringParam(
    'upvotesCountOrder',
    'any',
  )
  const [downvoteCountOrder, setDownvoteCountOrder] = useQueryStringParam(
    'downvoteCountOrder',
    'any',
  )
  const [completionCountOrder, setCompletionCountOrder] = useQueryStringParam(
    'completionCountOrder',
    'any',
  )
  const [postingOrder, setPostingOrder] = useQueryStringParam(
    'postingOrder',
    'descending',
  )
  const orders = useMemo(
    () => ({
      upvotesCount: ListingOrder.create(upvotesCountOrder),
      downvoteCount: ListingOrder.create(downvoteCountOrder),
      completionCount: ListingOrder.create(completionCountOrder),
      posting: ListingOrder.create(postingOrder),
    }),
    [upvotesCountOrder, downvoteCountOrder, completionCountOrder, postingOrder],
  )
  const { data: categoriesData } = useCache({
    key: 'challenge-categories',
    fetcher: () => service.fetchAllChallengeCategories(),
  })
  const [page, setPage] = useQueryNumberParam('page', 1)
  const [itemsPerPage, setItemsPerPage] = useQueryNumberParam('limit', 25)

  const { data: challengesData, isLoading } = useCache({
    key: 'challenges-page-list',
    dependencies: [
      debouncedSearch,
      difficulty,
      visibility,
      selectedCategories,
      page,
      itemsPerPage,
      orders,
    ],
    fetcher: async () =>
      await service.fetchChallengesList({
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        categoriesIds: IdsList.create(selectedCategories),
        completionStatus: ChallengeCompletionStatus.create('any'),
        difficulty: ChallengeDifficulty.create(difficulty),
        upvotesCountOrder: ListingOrder.create(upvotesCountOrder),
        downvoteCountOrder: ListingOrder.create(downvoteCountOrder),
        completionCountOrder: ListingOrder.create(completionCountOrder),
        postingOrder: ListingOrder.create(postingOrder),
        shouldIncludePrivateChallenges: Logical.create(
          visibility === 'all' || visibility === 'private',
        ),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        shouldIncludeStarChallenges: Logical.create(false),
        title: Text.create(debouncedSearch),
        userId: null,
      }),
  })

  const challenges = useMemo(() => {
    const items = challengesData?.items ?? []
    if (visibility === 'public') {
      return items.filter((challenge) => challenge.isPublic)
    }
    if (visibility === 'private') {
      return items.filter((challenge) => !challenge.isPublic)
    }
    return items
  }, [challengesData?.items, visibility])

  const categories = categoriesData ?? []
  const totalItemsCount = challengesData?.totalItemsCount ?? 0
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage)

  function handleNextPage() {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  function handlePrevPage() {
    if (page > 1) setPage((prev) => prev - 1)
  }

  function handlePageChange(page: number) {
    setPage(page)
  }

  function handleItemsPerPageChange(itemsPerPage: number) {
    setItemsPerPage(itemsPerPage)
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleDifficultyChange(value: string) {
    setDifficulty(value)
    setPage(1)
  }

  function handleVisibilityChange(value: string) {
    setVisibility(value)
    setPage(1)
  }

  function handleCategoriesChange(value: string[]) {
    setSelectedCategories(value)
    setPage(1)
  }

  function toggleCategory(categoryId: string) {
    if (selectedCategories.includes(categoryId)) {
      handleCategoriesChange(selectedCategories.filter((c) => c !== categoryId))
    } else {
      handleCategoriesChange([...selectedCategories, categoryId])
    }
  }

  function handleOrderChange(column: string, order: ListingOrder) {
    const orderValue = order.value as 'ascending' | 'descending' | 'any'

    switch (column) {
      case 'upvotesCount':
        setUpvotesCountOrder(orderValue)
        break
      case 'downvoteCount':
        setDownvoteCountOrder(orderValue)
        break
      case 'completionCount':
        setCompletionCountOrder(orderValue)
        break
      case 'posting':
        setPostingOrder(orderValue)
        break
    }
    setPage(1)
  }

  return {
    challenges,
    isLoading,
    categories,
    orders,
    handleOrderChange,
    filters: {
      search,
      difficulty,
      visibility,
      setSearch: handleSearchChange,
      selectedCategories,
      setDifficulty: handleDifficultyChange,
      setVisibility: handleVisibilityChange,
      setSelectedCategories: handleCategoriesChange,
      toggleCategory,
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
