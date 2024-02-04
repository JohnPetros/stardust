'use server'

import type { Star } from '@/@types/star'
import type { User } from '@/@types/user'
import { createSupabaseServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'

type CalculateStarRewardsParams = {
  newCoins: number
  newXp: number
  user: User
  nextStar: Pick<Star, 'id' | 'isUnlocked'> | null
  currentPlanetId: string
}

export async function calculateStarRewards({
  user,
  newCoins,
  newXp,
  nextStar,
}: CalculateStarRewardsParams): Promise<Partial<User>> {
  async function addUnlockedStar(UnlockedstarId: string) {
    const starsController = StarsController(createSupabaseServerClient())
    await starsController.addUnlockedStar(UnlockedstarId, user.id)
  }

  const updatedCoins = newCoins + user.coins
  const updatedXp = newXp + user.xp
  const updatedWeeklyXp = newXp + user.weekly_xp

  if (nextStar && !nextStar.isUnlocked) {
    await addUnlockedStar(nextStar.id)
  }

  return {
    coins: updatedCoins,
    xp: updatedXp,
    weekly_xp: updatedWeeklyXp,
  }
}
