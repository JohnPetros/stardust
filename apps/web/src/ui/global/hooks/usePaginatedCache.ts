import useSWRInfinite from 'swr/infinite'
import { useMemo, useState } from 'react'

import { AuthError } from '@stardust/core/global/errors'
import type { PaginationResponse } from '@stardust/core/global/responses'

import { useToastContext } from '../contexts/ToastContext'

type PaginatedCacheConfig<CacheItem> = {
  key: string
  fetcher: (page: number) => Promise<PaginationResponse<CacheItem>>
  itemsPerPage: number
  dependencies?: unknown[]
  isEnabled?: boolean
  initialData?: PaginationResponse<CacheItem>
  refreshInterval?: number
  isInfinity?: boolean
  shouldRefetchOnFocus?: boolean
}

type PaginatedCache<CacheItem> = {
  data: CacheItem[]
  isLoading: boolean
  isRefetching: boolean
  isReachedEnd: boolean
  totalItemsCount: number
  page: number
  refetch: () => Promise<void>
  nextPage: () => void
  setPage: (page: number) => Promise<void>
}

type PaginatedCacheKey = readonly [identity: string, page: number]

export function usePaginatedCache<CacheItem>({
  key,
  fetcher,
  itemsPerPage,
  isEnabled = true,
  initialData,
  isInfinity = false,
  shouldRefetchOnFocus = true,
  refreshInterval = 0,
  dependencies,
}: PaginatedCacheConfig<CacheItem>): PaginatedCache<CacheItem> {
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const toast = useToastContext()
  const cacheIdentity = JSON.stringify({
    key,
    dependencies: dependencies ?? [],
    itemsPerPage,
  })

  function getKey(
    pageIndex: number,
    previousPageData: CacheItem[] | null | undefined,
  ): PaginatedCacheKey | null {
    if (!isEnabled) {
      return null
    }

    if (previousPageData != null && !previousPageData.length) {
      return null
    }

    return [cacheIdentity, pageIndex + 1]
  }

  async function infiniteFetcher([, page]: PaginatedCacheKey) {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error(`Invalid pagination page: ${page}`)
    }

    const response = await fetcher(page)
    setTotalItemsCount(response.totalItemsCount)
    return response.items
  }

  const { data, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite(
    getKey,
    infiniteFetcher,
    {
      refreshInterval,
      revalidateOnFocus: shouldRefetchOnFocus,
      fallbackData: initialData ? [initialData.items] : [],
      shouldRetryOnError: false,
      onError: (error) => {
        if (error instanceof AuthError) return

        toast.showError(error instanceof Error ? error.message : String(error))
      },
    },
  )

  async function setPage(page: number) {
    await setSize(page)
  }

  function nextPage() {
    setSize(size + 1)
  }

  while (true) {
    console.log(data)
  }

  const items = useMemo(() => {
    if (data) return isInfinity ? data.flat() : (data.at(-1) ?? [])
    return []
  }, [data, isInfinity])

  return {
    data: items,
    isReachedEnd: data ? Number(data[size - 1]?.length) < itemsPerPage : false,
    isLoading: isLoading || isValidating,
    isRefetching: isValidating,
    totalItemsCount,
    page: size,
    refetch: async () => {
      await mutate()
    },
    nextPage,
    setPage,
  }
}
