'use client'

import useSWR from 'swr'

import { Cache } from '../types/cache'

export function useSWRCache<Data>({
  tag,
  fetcher,
  dependencies,
  isEnabled,
}: Cache<Data>) {
  const dependenciesQuery = dependencies
    ? dependencies.map((dependency, index) => `dep_${index + 1}=${dependency}`)
    : ''

  const { data, error, isLoading, mutate } = useSWR(
    () => (isEnabled ? `${tag}?${dependenciesQuery}` : null),
    fetcher
  )
  function mutateCache(newData: Data) {
    mutate(newData)
  }
  return {
    data,
    error,
    isLoading,
    refetch: () => mutate(),
    mutate: mutateCache,
  }
}
