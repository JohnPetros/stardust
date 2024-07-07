'use client'
import useSWR from 'swr'

import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'
import { CACHE } from '../constants/cache'

export function useRocket(rocketId: string) {
  const api = useApi()

  async function getRocket() {
    if (rocketId) return await api.getRocket(rocketId)
  }

  const { data: rocket } = useCache({
    key: CACHE.keys.rocket,
    fetcher: getRocket,
    dependencies: [rocketId],
  })

  return {
    rocket,
  }
}
