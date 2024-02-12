import { useSWRCache } from '../swr/useSWRCache'
import { Cache } from '../types/cache'

export function useCache<Data>(cache: Cache<Data>) {
  return useSWRCache(cache)
}
