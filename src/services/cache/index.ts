'use client'

import { Cache } from './types/cache'
import { useSWRCache } from './swr'

export function useCache<Data>(cache: Cache<Data>) {
  return useSWRCache(cache)
}
