import type { StarChallengePayload } from '@/@types/Rewards'
import { checkObject } from '@/global/helpers'

export function isStarChallengePayload(
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
