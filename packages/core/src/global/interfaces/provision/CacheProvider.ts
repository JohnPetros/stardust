export type CacheOptions = {
  expiresAt?: Date
}

export interface CacheProvider {
  get(key: string): Promise<string | null>
  set(key: string, value: string | number, options?: CacheOptions): Promise<void>
  getListItem(key: string, itemIndex: number): Promise<string | null>
  deleteListItem(key: string, itemIndex: number): Promise<void>
  delete(key: string): Promise<void>
}
