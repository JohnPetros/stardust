'use client'

import useSWR from 'swr'

type UseCacheProps<Data> = {
  tag: string
  fetcher: () => Promise<Data | undefined>
  dependencies?: unknown[]
  isEnabled?: boolean
}

export function useCache<Data>({
  tag,
  fetcher,
  dependencies = [],
  isEnabled = true,
}: UseCacheProps<Data>) {
  const dependenciesQuery = dependencies.map(
    (dependency, index) => `dep_${index + 1}=${dependency}`
  )

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
