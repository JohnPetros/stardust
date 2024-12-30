'use client'

import useSWRInfinite from 'swr/infinite'
import { useMemo, useState } from 'react'

import { useToastContext } from '../contexts/ToastContext'
import type { PaginationResponse } from '@stardust/core/responses'

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
  isRecheadedEnd: boolean
  totalItemsCount: number
  page: number
  refetch: () => void
  nextPage: () => void
  setPage: (page: number) => void
}

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
  const dependenciesQuery = dependencies
    ? dependencies.map((dependency, index) => `dep_${index + 1}=${dependency}`).join(',')
    : ''

  function getKey(pageIndex: number, previousPageData: CacheItem[]) {
    if (isEnabled && previousPageData && !previousPageData.length) {
      return null
    }
    return `${key}?${dependenciesQuery}&itemsPerPage=${itemsPerPage}&page=${pageIndex + 1}`
  }

  async function infiniteFetcher(key: string) {
    const page = Number(key.split('&page=').at(-1))
    console.log('infiniteFetcher', { page })
    const response = await fetcher(page)
    setTotalItemsCount(response.count)
    return response.items
  }

  const { data, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite(
    getKey,
    infiniteFetcher,
    {
      refreshInterval,
      revalidateOnFocus: shouldRefetchOnFocus,
      fallbackData: initialData ? [initialData.items] : [],
      onError: (error) => {
        toast.show(error)
      },
    },
  )

  function setPage(page: number) {
    setSize(page)
  }

  function nextPage() {
    setSize(size + 1)
  }

  const items = useMemo(() => {
    if (data) return isInfinity ? data.flat() : data.at(-1) ?? []
    return []
  }, [data, isInfinity])

  return {
    data: items,
    isRecheadedEnd: data ? Number(data[size - 1]?.length) < itemsPerPage : false,
    isLoading,
    isRefetching: isValidating,
    totalItemsCount,
    page: size,
    refetch: () => mutate(),
    nextPage,
    setPage,
  }
}
