'use server'

import { _calculateStarRewards } from './_calculateStarRewards'

import type { User } from '@/@types/User'
import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseStarsController } from '@/services/api/supabase/controllers/SupabaseStarsController'
import { SupabaseUsersController } from '@/services/api/supabase/controllers/SupabaseUsersController'

type _CalculateLessonRewardParams = {
  incorrectAnswers: number
  questions: number
  starId: string
  user: User
}

export async function _calculateLessonRewards({
  incorrectAnswers,
  questions,
  starId,
  user,
}: _CalculateLessonRewardParams) {
  const supabase = SupabaseServerClient()
  const usersController = SupabaseUsersController(supabase)
  const starsController = SupabaseStarsController(supabase)

  const currentStar = await starsController.getStarById(starId)
  const nextStar = await starsController.getNextStar(currentStar, user.id)

  function getAccurance() {
    const accurance = ((questions - incorrectAnswers) / questions) * 100
    return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
  }

  function getCoins() {
    let maxCoins = nextStar && nextStar.isUnlocked ? 5 : 10
    for (let i = 0; i < incorrectAnswers; i++) {
      maxCoins -= nextStar && nextStar.isUnlocked ? 1 : 2
    }
    return maxCoins
  }

  function getXp() {
    let maxXp = nextStar && nextStar.isUnlocked ? 10 : 20
    for (let i = 0; i < incorrectAnswers; i++) {
      maxXp -= nextStar && nextStar.isUnlocked ? 2 : 5
    }

    return maxXp
  }

  const newXp = getXp()
  const newCoins = getCoins()
  const accurance = getAccurance()

  const updatedUserData = await _calculateStarRewards({
    user,
    newCoins: getCoins(),
    newXp: getXp(),
    currentPlanetId: currentStar.planetId,
    nextStar: nextStar,
  })

  await usersController.updateUser(updatedUserData, user.id)

  return {
    xp: newXp,
    coins: newCoins,
    accurance,
  }
}
