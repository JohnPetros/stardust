'use client'

import { useAuth } from './useAuth'
import { useApi } from '@/services/api'
import useSWR from 'swr'

export function useStar(starId?: string) {
  const { user } = useAuth()
  const api = useApi()

  async function getStar() {
    if (starId && user?.id) {
      return await api.getStar(starId)
    }
  }

  const { data: star, error: starError } = useSWR(
    starId && user?.id ? '/star_id=' + starId : null,
    getStar
  )

  async function getNextStar() {
    if (star && user?.id) return await api.getNextStar(star, user.id)
  }

  const { data: nextStar, error: nextStarError } = useSWR(
    star && user?.id ? '/next_star?prev_star_id=' + star.id : null,
    getNextStar
  )

  if (starError) {
    throw new Error(starError)
  }

  if (nextStarError) {
    throw new Error(nextStarError)
  }

  return {
    star,
    nextStar,
  }
}
