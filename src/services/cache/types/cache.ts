export type Cache<Data> = {
  key: string
  fetcher: () => Promise<Data | undefined>
  dependencies?: unknown[]
  isEnabled?: boolean
  initialData?: Data
  refreshInterval?: number
  shouldRefetchOnFocus?: boolean
}
