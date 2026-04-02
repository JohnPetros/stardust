import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Action, Call } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'
import { Challenge } from '@stardust/core/challenging/entities'
import { CACHE_KEYS } from '@/constants/cache-keys'

type Request = {
  challengeId: string
  isPublic: boolean
}

type Response = {
  isPublic: boolean
}

export const UpdateChallengeVisibilityAction = (
  service: ChallengingService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { challengeId, isPublic } = call.getRequest()

      const challengeResponse = await service.fetchChallengeById(Id.create(challengeId))
      if (challengeResponse.isFailure) challengeResponse.throwError()

      const challenge = Challenge.create(challengeResponse.body)
      challenge.isPublic = isPublic

      const response = await service.updateChallenge(challenge)
      if (response.isFailure) response.throwError()

      call.resetCache(CACHE_KEYS.challenging.challenge)

      return { isPublic }
    },
  }
}
