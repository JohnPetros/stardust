import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import type { RestResponse } from '@stardust/core/global/responses'

import { useToastProvider } from './useToastProvider'

type MutateConfig = {
  shouldRevalidate: boolean
}

type FetchConfig<FetchData> = {
  key: string
  fetcher: () => Promise<RestResponse<FetchData>>
  onError?: (errorMessage: string) => void
  dependencies?: unknown[]
  isEnabled?: boolean
  initialData?: FetchData
  refreshInterval?: number
  shouldRefetchOnFocus?: boolean
  canShowErrorMessage?: boolean
}

type Fetch<FetchData> = {
  data: FetchData | null
  error: string
  isLoading: boolean
  isRefetching: boolean
  refetch: () => void
  updateData: (newFetchData: FetchData | null, config?: MutateConfig) => void
}

export function useFetch<FetchData>({
  key,
  fetcher,
  onError,
  dependencies,
  isEnabled = true,
  shouldRefetchOnFocus = true,
  refreshInterval = 0,
  initialData,
  canShowErrorMessage = true,
}: FetchConfig<FetchData>): Fetch<FetchData> {
  const queryClient = useQueryClient()
  const queryKey = dependencies ? [key, ...dependencies] : [key]
  const toast = useToastProvider()
  const {
    data,
    error,
    isLoading,
    isFetching: isRefetching,
    refetch,
  } = useQuery<FetchData | undefined, unknown>({
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

  const updateData = useCallback(
    (newFetchData: FetchData | null, mutateConfig?: MutateConfig) => {
      queryClient.setQueryData(queryKey, newFetchData)
      if (mutateConfig?.shouldRevalidate) {
        queryClient.invalidateQueries({ queryKey })
      }
    },
    [queryClient, queryKey],
  )

  return {
    data: (data ?? null) as FetchData | null,
    error: error instanceof Error ? error.message : error ? String(error) : '',
    isLoading,
    isRefetching,
    refetch,
    updateData,
  }
}
