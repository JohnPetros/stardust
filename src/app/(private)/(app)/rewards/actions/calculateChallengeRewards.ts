'use server'

import { calculateStarRewards } from './getStarReward'

import type { Difficulty } from '@/@types/challenge'
import type { User } from '@/@types/user'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { ChallengesController } from '@/services/api/supabase/controllers/challengesController'
import { StarsController } from '@/services/api/supabase/controllers/starsController'
import { UsersController } from '@/services/api/supabase/controllers/usersController'
import { CHALLENGE_REWARDS_BY_DIFFICULTY } from '@/utils/constants'

type ChallengeStarRewardParas = {
  incorrectAnswers: number
  difficulty: Difficulty
  isCompleted: boolean
  challengeId: string
  starId?: string
  user: User
}

export async function calculateChallengeRewards({
  incorrectAnswers,
  difficulty,
  isCompleted,
  challengeId,
  starId,
  user,
}: ChallengeStarRewardParas) {
  const supabase = createServerClient()
  const usersController = UsersController(supabase)

  function getAccurance() {
    const accurance = ((5 - incorrectAnswers) / 5) * 100
    return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
  }

  const difficultyRewards = CHALLENGE_REWARDS_BY_DIFFICULTY[difficulty]

  const newCoins = difficultyRewards.coins / (isCompleted ? 2 : 1)
  const newXp = difficultyRewards.xp / (isCompleted ? 2 : 1)
  const accurance = getAccurance()
  let userCompletedChallenges = user.completed_challenges

  if (isCompleted) {
    const challengesController = ChallengesController(supabase)

    await challengesController.addCompletedChallenge(challengeId, user.id)
    userCompletedChallenges++
  }

  if (starId) {
    const starsController = StarsController(supabase)

    const currentStar = await starsController.getStarById(starId)
    const nextStar = await starsController.getNextStar(currentStar, user.id)

    let updatedUserData = await calculateStarRewards({
      user,
      newCoins,
      newXp,
      currentPlanetId: currentStar.planet_id,
      nextStar,
    })

    updatedUserData = {
      ...updatedUserData,
      completed_challenges: userCompletedChallenges,
    }

    await usersController.updateUser(updatedUserData, user.id)

    return {
      xp: newXp,
      coins: newCoins,
      accurance,
    }
  }

  console.log({
    coins: user.coins + newCoins,
    xp: user.xp + newXp,
    weekly_xp: user.xp + newXp,
    completed_challenges: userCompletedChallenges,
  })

  await usersController.updateUser(
    {
      coins: user.coins + newCoins,
      xp: user.xp + newXp,
      weekly_xp: user.xp + newXp,
      completed_challenges: userCompletedChallenges,
    },
    user.id
  )

  return {
    xp: newXp,
    coins: newCoins,
    accurance,
  }
}