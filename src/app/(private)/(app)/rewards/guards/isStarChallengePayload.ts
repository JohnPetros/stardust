import type { StarChallengePayload } from '@/@types/Rewards'
import { checkObject } from '@/utils/helpers'

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
