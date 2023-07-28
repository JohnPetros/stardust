'use client'
import useSWR from 'swr'
import { api } from '@/services/api'

export function useRanking(rankingId?: string) {
  async function getRanking() {
    if (rankingId) {
      return await api.getRanking(rankingId)
    }
  }

  const { data: ranking } = useSWR(
    rankingId ? '/ranking?id=' + rankingId : null,
    getRanking
  )

  return {
    ranking,
  }
}
