import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import type { PaginationResponse, RestResponse } from '@stardust/core/global/responses'

import { useToastProvider } from './useToastProvider'

type PaginatedFetchConfig<FetchItem> = {
  key: string
  fetcher: (page: number) => Promise<RestResponse<PaginationResponse<FetchItem>>>
  itemsPerPage: number
  dependencies?: unknown[]
  isEnabled?: boolean
  initialData?: PaginationResponse<FetchItem>
  refreshInterval?: number
  isInfinity?: boolean
  shouldRefetchOnFocus?: boolean
}

type PaginatedFetch<FetchItem> = {
  data: FetchItem[]
  isFetching: boolean
  isRefetching: boolean
  isReachedEnd: boolean
  isFetchingNextPage: boolean
  totalItemsCount: number
  hasNextPage: boolean
  page: number
  refetch: () => void
  nextPage: () => void
  setPage: (page: number) => void
}

export function usePaginatedFetch<FetchItem>({
  key,
  fetcher,
  itemsPerPage,
  isEnabled = true,
  initialData,
  isInfinity = false,
  shouldRefetchOnFocus = true,
  refreshInterval = 0,
  dependencies,
}: PaginatedFetchConfig<FetchItem>): PaginatedFetch<FetchItem> {
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const toast = useToastProvider()

  const queryKey = useMemo(() => {
    const baseKey = [key]
    if (dependencies) {
      baseKey.push(...dependencies.map((dep) => String(dep)))
    }
    return baseKey
  }, [key, dependencies])

  const {
    data,
    isLoading,
    isFetching: isRefetching,
    hasNextPage,
    isFetchingNextPage,
    error,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetcher(pageParam)
      if (response.isFailure) response.throwError()
      setTotalItemsCount(response.body.totalItemsCount)
      return response.body
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length
      if (!lastPage.items) return undefined
      const hasMore = lastPage.items.length === itemsPerPage
      return hasMore ? currentPage + 1 : undefined
    },
    enabled: isEnabled,
    refetchInterval: refreshInterval > 0 ? refreshInterval : false,
    refetchOnWindowFocus: shouldRefetchOnFocus,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
  })

  useMemo(() => {
    if (error) {
      toast.showError(error instanceof Error ? error.message : String(error))
    }
  }, [error, toast])

  const items = useMemo(() => {
    if (!data?.pages) return []

    if (isInfinity) {
      return data.pages.flatMap((page) => page.items)
    } else {
      const lastPage = data.pages[data.pages.length - 1]
      return lastPage?.items ?? []
    }
  }, [data?.pages, isInfinity])

  const isReachedEnd = useMemo(() => {
    if (!data?.pages) return false
    const lastPage = data.pages[data.pages.length - 1]
    if (!lastPage.items) return false
    return lastPage ? lastPage.items.length < itemsPerPage : false
  }, [data?.pages, itemsPerPage])

  function setPage(page: number) {
    if (page > (data?.pages.length ?? 0)) {
      const pagesToFetch = page - (data?.pages.length ?? 0)
      for (let i = 0; i < pagesToFetch; i++) {
        fetchNextPage()
      }
    }
  }

  function nextPage() {
    fetchNextPage()
  }

  return {
    data: items,
    isReachedEnd,
    isFetching: isLoading,
    isFetchingNextPage,
    isRefetching,
    totalItemsCount,
    page: data?.pages.length ?? 0,
    hasNextPage,
    refetch: () => refetch(),
    nextPage,
    setPage,
  }
}
