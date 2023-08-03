import { api } from '@/services/api'
import useSWR from 'swr'

export function useRankedUsers(rankingId: string) {
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
