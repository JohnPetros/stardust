export type Cache<Data> = {
  tag: string
  fetcher: () => Promise<Data | undefined>
  dependencies?: unknown[]
  isEnabled?: boolean
}
