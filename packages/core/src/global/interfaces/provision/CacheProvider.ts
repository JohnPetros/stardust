export type CacheOptions = {
  expiresAt?: Date
}

export interface CacheProvider {
  get(key: string): Promise<string | null>
  set(key: string, value: string | number, options?: CacheOptions): Promise<void>
  popListItem(key: string): Promise<string | null>
  delete(key: string): Promise<void>
}
