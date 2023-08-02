'use client'

import useSWR from 'swr'
import { api } from '@/services/api'

export function useRanking(rankingId?: string, canGetAllRankings?: boolean) {
  async function getRanking() {
    if (rankingId) {
      return await api.getRanking(rankingId)
    }
  }

  async function getRankings() {
    if (rankingId) {
      return await api.getRankings()
    }
  }

  const { data: ranking, error: rankingError } = useSWR(
    rankingId ? '/ranking?id=' + rankingId : null,
    getRanking
  )

  const { data: rankings, error: rankingsError } = useSWR(
    canGetAllRankings ? '/rankings' : null,
    getRankings
  )

  if (rankingError) {
    throw new Error(rankingError)
  }

  if (rankingsError) {
    throw new Error(rankingsError)
  }

  return {
    ranking,
    rankings,
  }
}
