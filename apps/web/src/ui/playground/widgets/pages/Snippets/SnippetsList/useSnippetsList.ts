'use client'

import { Snippet } from '@stardust/core/playground/entities'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { type Id, OrdinalNumber } from '@stardust/core/global/structures'
import type { PlaygroundService } from '@stardust/core/playground/interfaces'

const SNIPPETS_PER_PAGE = OrdinalNumber.create(24)

export function useSnippetsList(playgroundService: PlaygroundService) {
  async function fetchSnippets(page: number) {
    const response = await playgroundService.fetchSnippetsList({
      page: OrdinalNumber.create(page),
      itemsPerPage: SNIPPETS_PER_PAGE,
    })

    if (response.isFailure) response.throwError()

    return response.body
  }

  const { data, page, totalItemsCount, isLoading, isRecheadedEnd, setPage, refetch } =
    usePaginatedCache({
      key: CACHE.keys.shopRockets,
      fetcher: fetchSnippets,
      shouldRefetchOnFocus: false,
      itemsPerPage: SNIPPETS_PER_PAGE.value,
    })

  function handleDeleteSnippet() {
    refetch()
  }

  function handlePaginationPageChange(page: number) {
    setPage(page)
  }

  return {
    snippets: data.map(Snippet.create),
    page,
    itemsPerPage: SNIPPETS_PER_PAGE.value,
    totalItemsCount,
    isLoading,
    isRecheadedEnd,
    handleDeleteSnippet,
    handlePaginationPageChange,
  }
}
