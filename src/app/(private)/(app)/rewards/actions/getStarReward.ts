'use server'

import type { Star } from '@/@types/star'
import type { User } from '@/@types/user'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'

type CalculateStarRewardsParams = {
  newCoins: number
  newXp: number
  user: User
  nextStar: Star | null
  currentPlanetId: string
}

export async function calculateStarRewards({
  user,
  newCoins,
  newXp,
  currentPlanetId,
  nextStar,
}: CalculateStarRewardsParams): Promise<Partial<User>> {
  async function addUnlockedStar(UnlockedstarId: string) {
    const starsController = StarsController(createServerClient())
    await starsController.addUnlockedStar(UnlockedstarId, user.id)
  }

  const updatedCoins = newCoins + user.coins
  const updatedXp = newXp + user.xp
  const updatedWeeklyXp = newXp + user.weekly_xp

  let completedPlanets = user.completed_planets
  let updatedUnlockedStars = user.unlocked_stars

  if (nextStar && nextStar.planet_id !== currentPlanetId) {
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
