'use client'

import useSWR from 'swr'

import { Cache } from '../types/cache'

export function useSWRCache<Data>({
  key,
  fetcher,
  dependencies,
  isEnabled = true,
  shouldRefetchOnFocus = true,
  refreshInterval = 0,
  initialData,
}: Cache<Data>) {
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

  function mutateCache(newData: Data) {
    mutate(newData)
  }

  return {
    data,
    error,
    isLoading,
    isRefetching: isValidating,
    refetch: () => mutate(),
    mutate: mutateCache,
  }
}
