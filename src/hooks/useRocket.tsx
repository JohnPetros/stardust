'use client'
import useSWR from 'swr'

import { useApi } from '@/services/api'

export function useRocket(rocketId: string) {
  const api = useApi()

  async function getRocket() {
    if (rocketId) return await api.getRocket(rocketId)
  }

  const { data: rocket } = useSWR(
    rocketId ? '/rocket?id=' + rocketId : null,
    getRocket
  )

  return {
    rocket,
  }
}
