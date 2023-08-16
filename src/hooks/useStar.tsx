'use client'

import { updateUserDataParam } from '@/app/(private)/(app)/lesson/components/End'
import { useAuth } from './useAuth'
import { useApi } from '@/services/api'
import { User } from '@/types/user'
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

  async function getNextStarFromNextPlanet() {
    if (!star || !user) return

    return await api.getNextStarFromNextPlanet(star.planet_id, user.id)
  }

  async function addUnlockedStar(UnlockedstarId: string) {
    if (!user) return

    await api.addUnlockedStar(UnlockedstarId, user.id)
  }
  
  async function updateUserData({
    newCoins,
    newXp,
    user,
  }: updateUserDataParam): Promise<Partial<User>> {
    const updatedCoins = newCoins + user.coins
    const updatedXp = newXp + user.xp
    const updatedWeeklyXp = newXp + user.weekly_xp
    // const updatedLevel = getUpdatedLevel(updatedXp)

    let completedPlanets = user.completed_planets
    let updatedUnlockedStars = user.unlocked_stars

    let _nextStar = nextStar

    if (!_nextStar) {
      _nextStar = await getNextStarFromNextPlanet()
      completedPlanets += _nextStar ? 1 : 0
    }


    if (_nextStar && !_nextStar.isUnlocked) {
      await addUnlockedStar(_nextStar.id)
      updatedUnlockedStars++
    }

    return {
      coins: updatedCoins,
      xp: updatedXp,
      weekly_xp: updatedWeeklyXp,
      // level: updatedLevel,
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
