'use server'

import type { Star } from '@/@types/Star'
import type { User } from '@/@types/User'
import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseStarsController } from '@/services/api/supabase/controllers/SupabaseStarsController'

type CalculateStarRewardsParams = {
  newCoins: number
  newXp: number
  user: User
  nextStar: Pick<Star, 'id' | 'isUnlocked'> | null
  currentPlanetId: string
}

export async function _calculateStarRewards({
  user,
  newCoins,
  newXp,
  nextStar,
}: CalculateStarRewardsParams): Promise<Partial<User>> {
  async function addUnlockedStar(UnlockedstarId: string) {
    const starsController = SupabaseStarsController(SupabaseServerClient())
    await starsController.addUnlockedStar(UnlockedstarId, user.id)
  }

  const updatedCoins = newCoins + user.coins
  const updatedXp = newXp + user.xp
  const updatedWeeklyXp = newXp + user.weeklyXp

  console.log({ nextStar })
  console.log(nextStar?.isUnlocked)

  if (nextStar && !nextStar.isUnlocked) {
    await addUnlockedStar(nextStar.id)
  }

  return {
    coins: updatedCoins,
    xp: updatedXp,
    weeklyXp: updatedWeeklyXp,
  }
}
