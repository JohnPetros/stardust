'use client'

import { Snippet } from '@stardust/core/playground/entities'

import { CACHE } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const SNIPPETS_PER_PAGE = 24

export function useSnippetsList() {
  const { user } = useAuthContext()
  const api = useApi()

  async function fetchSnippets(page: number) {
    const response = await api.fetchSnippetsList({
      authorId: String(user?.id.value),
      page,
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
      itemsPerPage: SNIPPETS_PER_PAGE,
      isEnabled: Boolean(user),
      dependencies: [user?.id.value],
    })

  function handleDeleteSnippetDelete() {
    refetch()
  }

  function handlePaginationPageChange(page: number) {
    setPage(page)
  }

  return {
    snippets: data.map(Snippet.create),
    page,
    itemsPerPage: SNIPPETS_PER_PAGE,
    totalItemsCount,
    isLoading,
    isRecheadedEnd,
    handleDeleteSnippetDelete,
    handlePaginationPageChange,
  }
}
