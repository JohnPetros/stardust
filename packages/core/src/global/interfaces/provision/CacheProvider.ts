export type CacheOptions = {
  expiresAt?: Date
}

export interface CacheProvider {
  get(key: string): Promise<string | null>
  set(key: string, value: string, options?: CacheOptions): Promise<void>
  getListItem(key: string, itemIndex: number): Promise<string | null>
  delete(key: string): Promise<void>
}
