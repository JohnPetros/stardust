'use server'

import { isChallengePayload } from '../guards/isChallengePayload'
import { isStarChallengePayload } from '../guards/isStarChallengePayload'
import { isStarPayload } from '../guards/isStarPayload'

import { _calculateChallengeRewards } from './_calculateChallengeRewards'
import { _calculateLessonRewards } from './_calculateLessonRewards'

import {
  ChallengePayload,
  type RewardsOrigin,
  type StarChallengePayload,
  type StarPayload,
} from '@/@types/Rewards'
import type { User } from '@/@types/User'
import { APP_ERRORS, ROUTES } from '@/global/constants'
import { IChallengesController } from '@/services/api/interfaces/IChallengesController'
import { IStarsController } from '@/services/api/interfaces/IStarsController'
import { IUsersController } from '@/services/api/interfaces/IUsersController'

let xp = 0
let coins = 0
let seconds = 0
let accurance = ''
let nextRoute = ''

type _GetRewardsPageData = {
  rewardsPayload: string
  user: User
  usersController: IUsersController
  challengesController: IChallengesController
  starsController: IStarsController
}

export async function _getRewardsPageData({
  user,
  rewardsPayload,
  challengesController,
  starsController,
  usersController,
}: _GetRewardsPageData) {
  const payloadObject = JSON.parse(rewardsPayload)
  const origin = Object.keys(payloadObject)[0] as RewardsOrigin

  switch (origin) {
    case 'star': {
      const starPaylod = Object.values(payloadObject)[0] as StarPayload

      console.log({ starPaylod })

      if (!isStarPayload(starPaylod))
        throw new Error(APP_ERRORS.rewards.payloadNotFound)

      const lessonRewards = await _calculateLessonRewards({
        user,
        incorrectAnswers: starPaylod.incorrectAnswers,
        questions: starPaylod.questions,
        starId: starPaylod.starId,
      })

      console.log('seconds', starPaylod.seconds)

      xp = lessonRewards.xp
      coins = lessonRewards.coins
      accurance = lessonRewards.accurance
      seconds = starPaylod.seconds
      nextRoute = ROUTES.private.home.space

      break
    }
    case 'star-challenge': {
      const starChallengePaylod = Object.values(
        payloadObject
      )[0] as StarChallengePayload

      if (!isStarChallengePayload(starChallengePaylod))
        throw new Error(APP_ERRORS.rewards.payloadNotFound)

      const challengeRewards = await _calculateChallengeRewards({
        challengesController,
        starsController,
        usersController,
        user,
        challengeId: starChallengePaylod.challengeId,
        difficulty: starChallengePaylod.difficulty,
        incorrectAnswers: starChallengePaylod.incorrectAnswers,
        isCompleted: starChallengePaylod.isCompleted,
        starId: starChallengePaylod.starId,
      })

      xp = challengeRewards.xp
      coins = challengeRewards.coins
      accurance = challengeRewards.accurance
      seconds = starChallengePaylod.seconds
      nextRoute = ROUTES.private.home.space
      break
    }
    case 'challenge': {
      const challengePaylod = Object.values(
        payloadObject
      )[0] as ChallengePayload

      if (!isChallengePayload(challengePaylod))
        throw new Error(APP_ERRORS.rewards.payloadNotFound)

      const challengeRewards = await _calculateChallengeRewards({
        challengesController,
        starsController,
        usersController,
        user,
        challengeId: challengePaylod.challengeId,
        difficulty: challengePaylod.difficulty,
        incorrectAnswers: challengePaylod.incorrectAnswers,
        isCompleted: challengePaylod.isCompleted,
        starId: null,
      })

      xp = challengeRewards.xp
      coins = challengeRewards.coins
      accurance = challengeRewards.accurance
      seconds = challengePaylod.seconds
      nextRoute = ROUTES.private.home.challenges
      break
    }
    default:
      throw new Error(APP_ERRORS.rewards.payloadNotFound)
  }

  return {
    xp,
    coins,
    seconds,
    accurance,
    nextRoute,
  }
}
