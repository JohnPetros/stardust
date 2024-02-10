'use client'

import useSWR from 'swr'

import { useApi } from '@/services/api'

export function useRanking(rankingId?: string, canGetAllRankings?: boolean) {
  const api = useApi()

  async function getRanking() {
    if (rankingId) {
      return await api.getRankingById(rankingId)
    }
  }

  async function getRankings() {
    return await api.getRankingsOrderedByPosition()
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
