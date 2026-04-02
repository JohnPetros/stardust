import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { ChallengeVote } from '@stardust/core/challenging/structures'
import type { Action, Call } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'
import { CACHE_KEYS } from '@/constants/cache-keys'

type Request = {
  challengeId: string
  challengeVote: string
}

type Response = {
  userChallengeVote: string
}

export const VoteChallengeAction = (
  service: ChallengingService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { challengeId, challengeVote } = call.getRequest()
      const response = await service.voteChallenge(
        Id.create(challengeId),
        ChallengeVote.create(challengeVote),
      )

      if (response.isFailure) response.throwError()

      call.resetCache(CACHE_KEYS.challenging.challenge)

      return response.body
    },
  }
}
