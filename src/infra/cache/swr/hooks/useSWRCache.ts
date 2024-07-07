'use client'

import useSWR from 'swr'

import type { CacheConfig, Cache, MudateConfig } from '../../types'

export function useSWRCache<CacheData>({
  key,
  fetcher,
  dependencies,
  isEnabled = true,
  shouldRefetchOnFocus = true,
  refreshInterval = 0,
  initialData,
}: CacheConfig<CacheData>): Cache<CacheData> {
  const dependenciesQuery = dependencies
    ? dependencies.map((dependency, index) => `dep_${index + 1}=${dependency}`)
    : ''

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    () => (isEnabled ? `${key}?${dependenciesQuery}` : null),
    fetcher,
    {
      fallbackData: initialData,
      refreshInterval,
      revalidateOnFocus: shouldRefetchOnFocus,
    }
  )

  function mutateCache(newCacheData: CacheData, mutateConfig: MudateConfig) {
    mutate(newCacheData, { revalidate: mutateConfig.shouldRevalidate })
  }

  return {
    data: data ?? null,
    error,
    isLoading,
    isRefetching: isValidating,
    refetch: () => mutate(),
    mutate: mutateCache,
  }
}
