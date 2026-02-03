export type CacheOptions = {
  expiresAt?: Date
}

export interface CacheProvider {
  get<Data = string>(key: string): Promise<Data | null>
  set<Data = string>(key: string, value: Data, options?: CacheOptions): Promise<void>
  delete(key: string): Promise<void>
}
