import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  ChallengeCategoryDto,
  ChallengeDto,
} from '@stardust/core/challenging/entities/dtos'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
  ChallengeIsNewStatus,
} from '@stardust/core/challenging/structures'
import type { User } from '@stardust/core/profile/entities'
import {
  IdsList,
  ListingOrder,
  Logical,
  OrdinalNumber,
  Text,
} from '@stardust/core/global/structures'

const ITEMS_PER_PAGE = 20

type Filters = {
  completionStatus: 'all' | 'completed' | 'not-completed'
  difficultyLevels: string[]
  categoriesIds: string[]
}

type Params = {
  isOpen: boolean
  currentChallengeSlug: string
  challengingService: ChallengingService
  isAccountAuthenticated: boolean
  user: User | null
  onClose: () => void
  onChallengeSelect: (challengeSlug: string) => void
}

export function useChallengesNavigationSidebar({
  isOpen,
  currentChallengeSlug,
  challengingService,
  isAccountAuthenticated,
  user,
  onClose,
  onChallengeSelect,
}: Params) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>({
    completionStatus: 'all',
    difficultyLevels: [],
    categoriesIds: [],
  })
  const [challenges, setChallenges] = useState<ChallengeDto[]>([])
  const [categories, setCategories] = useState<ChallengeCategoryDto[]>([])
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const [totalPagesCount, setTotalPagesCount] = useState(1)
  const [completedChallengesCount, setCompletedChallengesCount] = useState<number | null>(
    null,
  )
  const [sidebarTotalChallengesCount, setSidebarTotalChallengesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const activeFiltersCount = useMemo(() => {
    return [
      filters.completionStatus !== 'all',
      filters.difficultyLevels.length > 0,
      filters.categoriesIds.length > 0,
    ].filter(Boolean).length
  }, [filters])

  const loadSidebarData = useCallback(async () => {
    if (!isOpen) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const selectedDifficulty = filters.difficultyLevels[0] ?? 'all'
      const completionStatus = isAccountAuthenticated ? filters.completionStatus : 'all'

      const [listResponse, categoriesResponse, progressResponse] = await Promise.all([
        challengingService.fetchChallengesList({
          page: OrdinalNumber.create(page),
          itemsPerPage: OrdinalNumber.create(ITEMS_PER_PAGE),
          title: Text.create(search),
          categoriesIds: IdsList.create(filters.categoriesIds),
          difficulty: ChallengeDifficulty.create(selectedDifficulty),
          completionStatus: ChallengeCompletionStatus.create(completionStatus),
          isNewStatus: ChallengeIsNewStatus.create('all'),
          upvotesCountOrder: ListingOrder.create('any'),
          downvoteCountOrder: ListingOrder.create('any'),
          completionCountOrder: ListingOrder.create('any'),
          postingOrder: ListingOrder.create('ascending'),
          shouldIncludeOnlyAuthorChallenges: Logical.createAsFalse(),
          shouldIncludePrivateChallenges: Logical.createAsFalse(),
          shouldIncludeStarChallenges: Logical.createAsFalse(),
          userId: null,
        }),
        challengingService.fetchAllChallengeCategories(),
        challengingService.fetchChallengesNavigationSidebarProgress(),
      ])

      if (listResponse.isFailure) listResponse.throwError()
      if (categoriesResponse.isFailure) categoriesResponse.throwError()
      if (progressResponse.isFailure) progressResponse.throwError()

      setChallenges(listResponse.body.items)
      setTotalItemsCount(listResponse.body.totalItemsCount)
      setTotalPagesCount(Math.max(1, listResponse.body.totalPagesCount))
      setCategories(categoriesResponse.body)
      setCompletedChallengesCount(progressResponse.body.completedChallengesCount)
      setSidebarTotalChallengesCount(progressResponse.body.totalChallengesCount)
    } catch {
      setErrorMessage('Nao foi possivel carregar os desafios da barra lateral.')
    } finally {
      setIsLoading(false)
    }
  }, [challengingService, filters, isAccountAuthenticated, isOpen, page, search])

  useEffect(() => {
    loadSidebarData()
  }, [loadSidebarData])

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleApplyFilters(newFilters: Filters): void {
    setFilters({
      completionStatus: newFilters.completionStatus,
      difficultyLevels: newFilters.difficultyLevels.slice(0, 1),
      categoriesIds: newFilters.categoriesIds,
    })
    setPage(1)
  }

  function handleClearFilters(): void {
    setFilters({
      completionStatus: 'all',
      difficultyLevels: [],
      categoriesIds: [],
    })
    setPage(1)
  }

  function handlePreviousPageClick() {
    if (page <= 1) return

    setPage((currentPage) => currentPage - 1)
  }

  function handleNextPageClick() {
    if (page >= totalPagesCount) return

    setPage((currentPage) => currentPage + 1)
  }

  function handleChallengeClick(challengeSlug: string): void {
    onClose()
    onChallengeSelect(challengeSlug)
  }

  function refetch() {
    return loadSidebarData()
  }

  const paginationStart = totalItemsCount === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const paginationEnd = Math.min(page * ITEMS_PER_PAGE, totalItemsCount)

  return {
    isLoading,
    errorMessage,
    isEmpty: !isLoading && !errorMessage && challenges.length === 0,
    categories,
    challenges,
    page,
    totalPagesCount,
    paginationStart,
    paginationEnd,
    totalItemsCount,
    completedChallengesCount,
    sidebarTotalChallengesCount,
    activeFiltersCount,
    filters,
    currentChallengeSlug,
    isAccountAuthenticated,
    user,
    handleSearchChange,
    handleApplyFilters,
    handleClearFilters,
    handlePreviousPageClick,
    handleNextPageClick,
    handleChallengeClick,
    refetch,
  }
}
