import { api } from '@/services/api'
import useSWR from 'swr'

export function useStar(starId?: string) {
  async function getStar() {
    if (starId) {
      return await api.getStar(starId)
    }
  }

  const { data: star, error } = useSWR(
    starId ? '/ranking?id=' + starId : null,
    getStar
  )

  if (error) {
    throw new Error (error)
  }

  async function getNextStar() {
    if (star) return await api.getNextStar(star)
  }

  return {
    star,
    getNextStar,
  }
}
