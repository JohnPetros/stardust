import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { Challenge } from '@stardust/core/challenging/entities'
import { Slug } from '@stardust/core/global/structures'

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
      const response = await service.fetchChallengeBySlug(Slug.create(challengeSlug))
      if (response.isFailure) response.throwError()
      const challenge = Challenge.create(response.body)
      return {
        challengeId: challenge.id.value,
      }
    },
  }
}
