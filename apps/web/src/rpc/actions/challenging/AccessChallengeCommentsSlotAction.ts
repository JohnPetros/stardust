import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { Challenge } from '@stardust/core/challenging/entities'

type Request = {
  challengeSlug: string
}

type Response = {
  challengeId: string
}

export const AccessChallengeCommentsSlotAction = (
  service: ChallengingService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { challengeSlug } = call.getRequest()
      const response = await service.fetchChallengeBySlug(challengeSlug)
      if (response.isFailure) response.throwError()
      const challenge = Challenge.create(response.body)
      return {
        challengeId: challenge.id.value,
      }
    },
  }
}
