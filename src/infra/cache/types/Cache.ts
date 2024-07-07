import type { MudateConfig } from './MutateConfig'

export type Cache<CacheData> = {
  data: CacheData | null
  error: string
  isLoading: boolean
  isRefetching: boolean
  refetch: () => void
  mutate: (newCacheData: CacheData, consig: MudateConfig) => void
}
