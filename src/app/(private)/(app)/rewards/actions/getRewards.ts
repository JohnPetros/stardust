'use server'

import { calculateLessonRewards } from './calculateLessonRewards'

import { User } from '@/@types/user'
import { ROUTES } from '@/utils/constants'

type StarPayload = {
  incorrectAnswers: number
  questions: number
  starSlug: string
  seconds: number
}

let xp = 0
let coins = 0
let seconds = 0
let accurance = ''
let nextRoute = ''

export async function getRewards(payload: string, user: User) {
  const payloadObject = JSON.parse(payload)
  const origin = Object.keys(payloadObject)[0]

  switch (origin) {
    case 'star': {
      const starPaylod = Object.values(payloadObject)[0] as StarPayload

      const lessonRewards = await calculateLessonRewards({
        user,
        incorrectAnswers: starPaylod.incorrectAnswers,
        questions: starPaylod.questions,
        starSlug: starPaylod.starSlug,
      })

      xp = lessonRewards.xp
      coins = lessonRewards.coins
      accurance = lessonRewards.accurance
      seconds = starPaylod.seconds
      nextRoute = ROUTES.private.home.space
      break
    }
    default:
      throw new Error('Internal server error')
  }

  return {
    xp,
    coins,
    seconds,
    accurance,
    nextRoute,
  }
}
