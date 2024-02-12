'use client'

import { mutate as mutateGlobalCache } from 'swr'

export function useSWRGlobalCache() {
  function mutate(key: string, newData: unknown) {
    mutateGlobalCache(key, newData)
  }

  return {
    mutate,
  }
}
