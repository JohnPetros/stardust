import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import type { RestResponse } from '@stardust/core/global/responses'

import { useToast } from './useToast'

type MutateConfig = {
  shouldRevalidate: boolean
}

type CacheConfig<CacheData> = {
  key: string
  fetcher: () => Promise<RestResponse<CacheData>>
  onError?: (errorMessage: string) => void
  dependencies?: unknown[]
  isEnabled?: boolean
  initialData?: CacheData
  refreshInterval?: number
  shouldRefetchOnFocus?: boolean
  canShowErrorMessage?: boolean
}

type Cache<CacheData> = {
  data: CacheData | null
  error: string
  isLoading: boolean
  isRefetching: boolean
  refetch: () => void
  updateCache: (newCacheData: CacheData | null, config?: MutateConfig) => void
}

export function useCache<CacheData>({
  key,
  fetcher,
  onError,
  dependencies,
  isEnabled = true,
  shouldRefetchOnFocus = true,
  refreshInterval = 0,
  initialData,
  canShowErrorMessage = true,
}: CacheConfig<CacheData>): Cache<CacheData> {
  const queryClient = useQueryClient()
  const queryKey = dependencies ? [key, ...dependencies] : [key]
  const toast = useToast()
  const {
    data,
    error,
    isLoading,
    isFetching: isRefetching,
    refetch,
  } = useQuery<CacheData | undefined, unknown>({
    queryKey,
    queryFn: async () => {
      const response = await fetcher()

      if (response.isFailure && canShowErrorMessage) {
        toast.showError(response.errorMessage)
        if (onError) onError(response.errorMessage)
        return
      }

      return response.body
    },
    enabled: isEnabled,
    initialData,
    refetchInterval: refreshInterval > 0 ? refreshInterval : false,
    refetchOnWindowFocus: shouldRefetchOnFocus,
  })

  const updateCache = useCallback(
    (newCacheData: CacheData | null, mutateConfig?: MudateConfig) => {
      queryClient.setQueryData(queryKey, newCacheData)
      if (mutateConfig?.shouldRevalidate) {
        queryClient.invalidateQueries({ queryKey })
      }
    },
    [queryClient, queryKey],
  )

  return {
    data: (data ?? null) as CacheData | null,
    error: error instanceof Error ? error.message : error ? String(error) : '',
    isLoading,
    isRefetching,
    refetch,
    updateCache,
  }
}
