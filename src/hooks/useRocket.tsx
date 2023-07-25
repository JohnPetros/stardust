import { api } from '@/services/api'
import useSWR from 'swr'

export function useRocket(rocketId?: string) {
  async function getRocket() {
    if (rocketId) return await api.getRocket(rocketId)
  }

  const { data: rocket } = useSWR(rocketId ? 'rocket' : null, getRocket)

  return {
    rocket,
  }
}
