import useSWR from 'swr'

import { useApi } from '@/services/api'

export function useRankedUsers(rankingId: string) {
  const api = useApi()

  async function getUsersByRanking() {
    return await api.getUsersByRanking(rankingId)
  }

  const { data: rankedUsers, error } = useSWR(
    rankingId ? 'ranked_users' : null,
    getUsersByRanking
  )

  if (error) {
    throw new Error(error)
  }

  return {
    rankedUsers,
  }
}
