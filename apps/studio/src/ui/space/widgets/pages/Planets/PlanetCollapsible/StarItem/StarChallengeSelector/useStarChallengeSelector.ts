import { useState } from 'react'

import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import {
  Id,
  IdsList,
  ListingOrder,
  Logical,
  OrdinalNumber,
  Text,
  type Id as IdType,
} from '@stardust/core/global/structures'

import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { useFetch } from '@/ui/global/hooks/useFetch'

type Params = {
  starId: IdType
  challengingService: ChallengingService
  toastProvider: ToastProvider
  onChallengeLinked?: (challengeId: string) => Promise<void> | void
}

export function useStarChallengeSelector({
  starId,
  challengingService,
  toastProvider,
  onChallengeLinked,
}: Params) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, error, refetch } = useFetch({
    key: 'star-challenge-selector-list',
    dependencies: [isOpen, page, itemsPerPage, debouncedSearch, starId.value],
    isEnabled: isOpen,
    fetcher: async () =>
      await challengingService.fetchChallengesList({
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        categoriesIds: IdsList.create([]),
        completionStatus: ChallengeCompletionStatus.create('any'),
        difficulty: ChallengeDifficulty.create('any'),
        upvotesCountOrder: ListingOrder.create('any'),
        downvoteCountOrder: ListingOrder.create('any'),
        completionCountOrder: ListingOrder.create('any'),
        postingOrder: ListingOrder.create('descending'),
        shouldIncludePrivateChallenges: Logical.create(true),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        shouldIncludeStarChallenges: Logical.create(false),
        title: Text.create(debouncedSearch),
        userId: null,
      }),
  })

  const challenges = data?.items ?? []

  const totalItemsCount = data?.totalItemsCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItemsCount / itemsPerPage))

  async function handleSelectChallenge(challengeId: string) {
    setIsLinking(true)

    if (onChallengeLinked) {
      try {
        await onChallengeLinked(challengeId)
        setIsOpen(false)
        return
      } finally {
        setIsLinking(false)
      }
    }

    const response = await challengingService.editChallengeStar(
      Id.create(challengeId),
      starId,
    )
    setIsLinking(false)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    toastProvider.showSuccess('Desafio vinculado com sucesso')
    setIsOpen(false)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
  }

  function handleNextPage() {
    if (page < totalPages) {
      setPage((currentPage) => currentPage + 1)
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1)
    }
  }

  function handleItemsPerPageChange(nextItemsPerPage: number) {
    setItemsPerPage(nextItemsPerPage)
    setPage(1)
  }

  function handleOpenChange(nextIsOpen: boolean) {
    setIsOpen(nextIsOpen)
    if (!nextIsOpen) {
      return
    }
    refetch()
  }

  return {
    isOpen,
    isLoading: isLoading || isLinking,
    hasError: Boolean(error),
    search,
    challenges,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage,
    handleOpenChange,
    handleSearchChange,
    handleSelectChallenge,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handleItemsPerPageChange,
  }
}
