import type { StarPayload } from '@/@types/Rewards'
import { checkObject } from '@/utils/helpers'

export function isStarPayload(payload: StarPayload): payload is StarPayload {
  const starPayloadPropeties: (keyof StarPayload)[] = [
    'incorrectAnswers',
    'questions',
    'seconds',
    'starId',
  ]
  return checkObject<StarPayload>(payload, starPayloadPropeties)
}
