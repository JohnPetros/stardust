'use server'

import { calculateStarRewards } from './getStarReward'

import type { User } from '@/@types/user'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'
import { UsersController } from '@/services/api/supabase/controllers/usersController'

type LessonStarRewardParas = {
  incorrectAnswers: number
  questions: number
  starId: string
  user: User
}

export async function calculateLessonRewards({
  incorrectAnswers,
  questions,
  starId,
  user,
}: LessonStarRewardParas) {
  const supabase = createServerClient()
  const usersController = UsersController(supabase)
  const starsController = StarsController(supabase)

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

  const updatedUserData = await calculateStarRewards({
    user,
    newCoins: getCoins(),
    newXp: getXp(),
    currentPlanetId: currentStar.planet_id,
    nextStar: nextStar,
  })

  await usersController.updateUser(updatedUserData, user.id)

  return {
    xp: newXp,
    coins: newCoins,
    accurance,
  }
}
