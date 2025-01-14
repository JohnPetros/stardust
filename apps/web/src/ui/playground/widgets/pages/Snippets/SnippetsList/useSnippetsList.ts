'use client'

import { useRouter } from 'next/navigation'

import { Snippet } from '@stardust/core/playground/entities'

import { CACHE } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const SNIPPETS_PER_PAGE = 24

export function useSnippetsList() {
  const { user } = useAuthContext()
  const api = useApi()
  const router = useRouter()

  async function fetchSnippets(page: number) {
    const response = await api.fetchSnippetsList({
      authorId: String(user?.id),
      page,
      itemsPerPage: SNIPPETS_PER_PAGE,
    })

    if (response.isFailure) response.throwError()

    return response.body
  }

  const { data, page, totalItemsCount, isLoading, setPage, refetch } = usePaginatedCache({
    key: CACHE.keys.shopRockets,
    fetcher: fetchSnippets,
    itemsPerPage: SNIPPETS_PER_PAGE,
    isEnabled: Boolean(user),
  })

  function handleDeleteSnippetDelete() {
    refetch()
  }

  return {
    snippets: data.map(Snippet.create),
    isLoading,
    handleDeleteSnippetDelete,
  }
}
