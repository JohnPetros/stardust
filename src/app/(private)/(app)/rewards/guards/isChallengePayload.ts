import { ChallengePayload } from '@/@types/Rewards'
import { checkObject } from '@/global/helpers'

export function isChallengePayload(
  payload: ChallengePayload
): payload is ChallengePayload {
  const challengePayloadProperties: (keyof ChallengePayload)[] = [
    'incorrectAnswers',
    'seconds',
    'challengeId',
    'difficulty',
    'isCompleted',
  ]
  return checkObject<ChallengePayload>(payload, challengePayloadProperties)
}
