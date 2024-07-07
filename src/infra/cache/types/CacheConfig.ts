export type CacheConfig<CacheData> = {
  key: string
  fetcher: () => Promise<CacheData | undefined>
  dependencies?: unknown[]
  isEnabled?: boolean
  initialData?: CacheData
  refreshInterval?: number
  shouldRefetchOnFocus?: boolean
}
