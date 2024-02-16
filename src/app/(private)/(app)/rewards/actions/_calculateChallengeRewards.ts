'use server'

import { _calculateStarRewards } from './_calculateStarRewards'

import type { ChallengeDifficulty } from '@/@types/Challenge'
import type { User } from '@/@types/User'
import { CHALLENGE_REWARDS_BY_DIFFICULTY } from '@/global/constants'
import { IChallengesController } from '@/services/api/interfaces/IChallengesController'
import { IStarsController } from '@/services/api/interfaces/IStarsController'
import { IUsersController } from '@/services/api/interfaces/IUsersController'

type _CalculateChallengeRewardsParams = {
  incorrectAnswers: number
  difficulty: ChallengeDifficulty
  isCompleted: boolean
  challengeId: string
  starId: string | null
  user: User
  usersController: IUsersController
  challengesController: IChallengesController
  starsController: IStarsController
}

export async function _calculateChallengeRewards({
  incorrectAnswers,
  difficulty,
  isCompleted,
  challengeId,
  starId,
  user,
  challengesController,
  starsController,
  usersController,
}: _CalculateChallengeRewardsParams) {
  function getAccurance() {
    const accurance = ((5 - incorrectAnswers) / 5) * 100
    return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
  }

  const difficultyRewards = CHALLENGE_REWARDS_BY_DIFFICULTY[difficulty]

  const newCoins = difficultyRewards.coins / (isCompleted ? 2 : 1)
  const newXp = difficultyRewards.xp / (isCompleted ? 2 : 1)
  const accurance = getAccurance()

  if (!isCompleted) {
    await challengesController.addCompletedChallenge(challengeId, user.id)
  }

  if (starId) {
    const currentStar = await starsController.getStarById(starId)

    let nextStar = await starsController.getNextStar(currentStar, user.id)

    if (!nextStar) {
      console.log('OIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
      nextStar = await starsController.getNextStarFromNextPlanet(
        currentStar.planetId,
        user.id
      )
    }

    console.log({ currentStar })
    console.log({ nextStar })

    let updatedUserData = await _calculateStarRewards({
      user,
      newCoins,
      newXp,
      currentPlanetId: currentStar.planetId,
      nextStar,
    })

    updatedUserData = {
      ...updatedUserData,
    }

    await usersController.updateUser(updatedUserData, user.id)

    return {
      xp: newXp,
      coins: newCoins,
      accurance,
    }
  }

  await usersController.updateUser(
    {
      coins: user.coins + newCoins,
      xp: user.xp + newXp,
      weeklyXp: user.xp + newXp,
    },
    user.id
  )

  return {
    xp: newXp,
    coins: newCoins,
    accurance,
  }
}
