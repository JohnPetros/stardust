'use client'

import useSWR from 'swr'

import type { Star } from '@/@types/star'
import type { User } from '@/@types/user'
import { updateUserDataParams } from '@/app/(private)/(app)/lesson/components/End'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'

export function useStar(star: Star) {
  const { user } = useAuth()
  const api = useApi()

  async function getNextStar() {
    if (user) {
      let nextStar = await api.getNextStar(star, user.id)

      if (!nextStar) {
        nextStar = await api.getNextStarFromNextPlanet(star.planet_id, user.id)
      }

      return nextStar
    }
  }

  const { data: nextStar, error: nextStarError } = useSWR(
    star?.id && user?.id ? '/next_star?prev_star_id=' + star.id : null,
    getNextStar
  )

  if (nextStarError) {
    throw new Error(nextStarError)
  }

  async function addUnlockedStar(UnlockedstarId: string) {
    if (!user) return

    await api.addUnlockedStar(UnlockedstarId, user.id)
  }

  async function updateUserData({
    newCoins,
    newXp,
    user,
  }: updateUserDataParams): Promise<Partial<User>> {
    const updatedCoins = newCoins + user.coins
    const updatedXp = newXp + user.xp
    const updatedWeeklyXp = newXp + user.weekly_xp

    let completedPlanets = user.completed_planets
    let updatedUnlockedStars = user.unlocked_stars

    if (nextStar && nextStar.planet_id !== star.planet_id) {
      completedPlanets += nextStar ? 1 : 0
    }

    if (nextStar && !nextStar.isUnlocked) {
      await addUnlockedStar(nextStar.id)
      updatedUnlockedStars++
    }

    return {
      coins: updatedCoins,
      xp: updatedXp,
      weekly_xp: updatedWeeklyXp,
      unlocked_stars: updatedUnlockedStars,
      completed_planets: completedPlanets,
    }
  }

  return {
    star,
    nextStar,
    updateUserData,
  }
}
