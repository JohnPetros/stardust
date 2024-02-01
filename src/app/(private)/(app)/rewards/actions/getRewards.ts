'use server'

import { calculateChallengeRewards } from './calculateChallengeRewards'
import { calculateLessonRewards } from './calculateLessonRewards'

import {
  type RewardsOrigin,
  type StarChallengePayload,
  type StarPayload,
} from '@/@types/rewards'
import type { User } from '@/@types/user'
import { ERRORS, ROUTES } from '@/utils/constants'
import { checkObject } from '@/utils/helpers'

function isStarPayload(payload: StarPayload): payload is StarPayload {
  const starPayloadPropeties: (keyof StarPayload)[] = [
    'incorrectAnswers',
    'questions',
    'seconds',
    'starId',
  ]
  return checkObject<StarPayload>(payload, starPayloadPropeties)
}

function isStarChallengePayload(
  payload: StarChallengePayload
): payload is StarChallengePayload {
  const starChallengePayloadProperties: (keyof StarChallengePayload)[] = [
    'incorrectAnswers',
    'seconds',
    'starId',
    'challengeId',
    'difficulty',
    'isCompleted',
  ]
  return checkObject<StarChallengePayload>(
    payload,
    starChallengePayloadProperties
  )
}

let xp = 0
let coins = 0
let seconds = 0
let accurance = ''
let nextRoute = ''

export async function getRewards(payload: string, user: User) {
  const payloadObject = JSON.parse(payload)
  const origin = Object.keys(payloadObject)[0] as RewardsOrigin

  switch (origin) {
    case 'star': {
      const starPaylod = Object.values(payloadObject)[0] as StarPayload

      if (!isStarPayload(starPaylod))
        throw new Error(ERRORS.rewards.payloadNotFound)

      const lessonRewards = await calculateLessonRewards({
        user,
        incorrectAnswers: starPaylod.incorrectAnswers,
        questions: starPaylod.questions,
        starId: starPaylod.starId,
      })

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
        throw new Error(ERRORS.rewards.payloadNotFound)

      const challengeRewards = await calculateChallengeRewards({
        challengeId: starChallengePaylod.challengeId,
        difficulty: starChallengePaylod.difficulty,
        incorrectAnswers: starChallengePaylod.incorrectAnswers,
        isCompleted: starChallengePaylod.isCompleted,
        starId: starChallengePaylod.starId,
        user,
      })

      xp = challengeRewards.xp
      coins = challengeRewards.coins
      accurance = challengeRewards.accurance
      seconds = starChallengePaylod.seconds
      nextRoute = ROUTES.private.home.space
      break
    }
    default:
      throw new Error(ERRORS.rewards.payloadNotFound)
  }

  return {
    xp,
    coins,
    seconds,
    accurance,
    nextRoute,
  }
}
