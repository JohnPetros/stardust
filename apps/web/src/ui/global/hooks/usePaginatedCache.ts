'use client'

import useSWRInfinite from 'swr/infinite'

import { useToastContext } from '../contexts/ToastContext'

type PaginatedCacheConfig<CacheItem> = {
  key: string
  fetcher: (page: number) => Promise<CacheItem[]>
  itemsPerPage: number
  dependencies?: unknown[]
  isEnabled?: boolean
  initialData?: CacheItem
  refreshInterval?: number
  shouldRefetchOnFocus?: boolean
}

type PaginatedCache<CacheItem> = {
  data: CacheItem[]
  isLoading: boolean
  isRefetching: boolean
  isRecheadedEnd: boolean
  refetch: () => void
  nextPage: () => void
  setPage: (page: number) => void
}

export function usePaginatedCache<CacheItem>({
  key,
  fetcher,
  itemsPerPage,
  isEnabled = true,
  shouldRefetchOnFocus = true,
  refreshInterval = 0,
  dependencies,
}: PaginatedCacheConfig<CacheItem>): PaginatedCache<CacheItem> {
  const toast = useToastContext()
  const dependenciesQuery = dependencies
    ? dependencies.map((dependency, index) => `dep_${index + 1}=${dependency}`).join(',')
    : ''

  function getKey(pageIndex: number, previousPageData: CacheItem[]) {
    if (isEnabled && previousPageData && !previousPageData.length) {
      return null
    }
    return `${key}?${dependenciesQuery}&itemsPerPage=${itemsPerPage}&page=${pageIndex}`
  }

  async function infiniteFetcher(key: string) {
    const page = Number(key.split('&page=').at(-1))
    return await fetcher(page)
  }

  const { data, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite(
    getKey,
    infiniteFetcher,
    {
      refreshInterval,
      revalidateOnFocus: shouldRefetchOnFocus,
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

  return {
    data: data?.length ? (data.flat() as CacheItem[]) : [],
    isRecheadedEnd: data ? Number(data[size - 1]?.length) < itemsPerPage : false,
    isLoading,
    isRefetching: isValidating,
    refetch: () => mutate(),
    nextPage,
    setPage,
  }
}
