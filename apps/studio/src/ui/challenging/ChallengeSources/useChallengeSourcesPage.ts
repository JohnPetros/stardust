import { useEffect, useMemo, useState } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ChallengeSourceDto } from '@stardust/core/challenging/entities/dtos'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import {
  Id,
  IdsList,
  ListingOrder,
  OrdinalNumber,
  Text,
  Url,
} from '@stardust/core/global/structures'

import { CACHE } from '@/constants/cache'
import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { useFetch } from '@/ui/global/hooks/useFetch'
import { useQueryNumberParam } from '@/ui/global/hooks/useQueryNumberParam'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'

type Params = {
  challengingService: ChallengingService
  toastProvider: ToastProvider
}

export function useChallengeSourcesPage({ challengingService, toastProvider }: Params) {
  const [search, setSearch] = useQueryStringParam('q', '')
  const [page, setPage] = useQueryNumberParam('page', 1)
  const [itemsPerPage, setItemsPerPage] = useQueryNumberParam('limit', 10)
  const debouncedSearch = useDebounce(search, 500)
  const [challengeSources, setChallengeSources] = useState<ChallengeSourceDto[]>([])
  const [isReordering, setIsReordering] = useState(false)

  const {
    data: challengeSourcesData,
    isLoading,
    refetch,
  } = useFetch({
    key: CACHE.challengeSourcesTable.key,
    dependencies: [debouncedSearch, page, itemsPerPage],
    fetcher: async () =>
      await challengingService.fetchChallengeSourcesList({
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        title: Text.create(debouncedSearch),
        positionOrder: ListingOrder.createAsAscending(),
      }),
  })

  useEffect(() => {
    const items = challengeSourcesData?.items ?? []
    setChallengeSources(items)
  }, [challengeSourcesData?.items])

  const totalItemsCount = challengeSourcesData?.totalItemsCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItemsCount / itemsPerPage))

  const sortableChallengeSources = useMemo(() => {
    return challengeSources
      .filter((challengeSource) => Boolean(challengeSource.id))
      .map((challengeSource) => ({
        id: challengeSource.id,
        data: challengeSource,
      }))
  }, [challengeSources])

  const sortableKey = useMemo(() => {
    return sortableChallengeSources.map((challengeSource) => challengeSource.id).join('-')
  }, [sortableChallengeSources])

  async function handleCreateChallengeSource(
    url: string,
    challengeId?: string,
    additionalInstructions?: string | null,
  ) {
    try {
      const normalizedAdditionalInstructions = additionalInstructions?.trim()
      const response = await challengingService.createChallengeSource(
        challengeId ? Id.create(challengeId) : null,
        Url.create(url),
        normalizedAdditionalInstructions
          ? Text.create(normalizedAdditionalInstructions)
          : null,
      )

      if (response.isFailure) {
        return response.errorMessage
      }

      toastProvider.showSuccess('Fonte criada com sucesso')
      refetch()
      return null
    } catch {
      return 'Não foi possível criar a fonte de desafio'
    }
  }

  async function handleUpdateChallengeSource(
    challengeSourceId: string,
    url: string,
    challengeId: string | undefined,
    additionalInstructions?: string | null,
  ) {
    try {
      const normalizedAdditionalInstructions = additionalInstructions?.trim()
      const response = await challengingService.updateChallengeSource(
        Id.create(challengeSourceId),
        Url.create(url),
        challengeId ? Id.create(challengeId) : null,
        normalizedAdditionalInstructions
          ? Text.create(normalizedAdditionalInstructions)
          : null,
      )

      if (response.isFailure) {
        return response.errorMessage
      }

      toastProvider.showSuccess('Fonte atualizada com sucesso')
      refetch()
      return null
    } catch {
      return 'Não foi possível atualizar a fonte de desafio'
    }
  }

  async function handleDeleteChallengeSource(challengeSourceId: string) {
    const response = await challengingService.deleteChallengeSource(
      Id.create(challengeSourceId),
    )

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    toastProvider.showSuccess('Fonte removida com sucesso')
    refetch()
  }

  async function handleReorderChallengeSources(
    reorderedChallengeSources: ChallengeSourceDto[],
  ) {
    const previousChallengeSources = challengeSources
    setChallengeSources(reorderedChallengeSources)
    setIsReordering(true)

    const challengeSourceIds = IdsList.create(
      reorderedChallengeSources.map((challengeSource) => challengeSource.id),
    )
    const response = await challengingService.reorderChallengeSources(challengeSourceIds)
    setIsReordering(false)

    if (response.isFailure) {
      setChallengeSources(previousChallengeSources)
      toastProvider.showError(response.errorMessage)
      return
    }

    setChallengeSources(response.body)
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
      setPage(page + 1)
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleItemsPerPageChange(nextItemsPerPage: number) {
    setItemsPerPage(nextItemsPerPage)
    setPage(1)
  }

  return {
    search,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage,
    challengeSources,
    sortableChallengeSources,
    sortableKey,
    isLoading,
    isReordering,
    onSearchChange: handleSearchChange,
    onPageChange: handlePageChange,
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onItemsPerPageChange: handleItemsPerPageChange,
    onCreateChallengeSource: handleCreateChallengeSource,
    onUpdateChallengeSource: handleUpdateChallengeSource,
    onDeleteChallengeSource: handleDeleteChallengeSource,
    onReorderChallengeSources: handleReorderChallengeSources,
  }
}
