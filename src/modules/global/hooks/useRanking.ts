'use client'

import useSWR from 'swr'

import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'
import { CACHE } from '../constants/cache'

export function useRanking(rankingId?: string, canGetAllRankings?: boolean) {
  const api = useApi()

  async function getRanking() {
    if (rankingId) {
      const ranking = await api.getRankingById(rankingId)
      return ranking
    }
  }

  async function getRankings() {
    return await api.getRankingsOrderedByPosition()
  }

  const { data: ranking, error: rankingError } = useCache({
    key: CACHE.keys.ranking,
    fetcher: getRanking,
    dependencies: [rankingId],
    isEnabled: !!rankingId,
  })

  const { data: rankings, error: rankingsError } = useCache({
    key: CACHE.keys.rankingsList,
    fetcher: getRankings,
    dependencies: [canGetAllRankings],
    isEnabled: canGetAllRankings,
  })

  if (rankingError) {
    console.log({ rankingError })
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
