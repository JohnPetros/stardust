import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { VoteChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { User } from '@stardust/core/global/entities'

type Request = {
  challengeId: string
  userChallengeVote: ChallengeVote
}

type Response = {
  upvotesCount: number
  downvotesCount: number
  userChallengeVote: ChallengeVote
}

export const VoteChallengeAction = (
  challengingService: ChallengingService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const user = User.create(await call.getUser())
      const { challengeId, userChallengeVote } = call.getRequest()
      const useCase = new VoteChallengeUseCase(challengingService)
      const data = await useCase.do({
        challengeId: challengeId,
        userId: user.id,
        userChallengeVote,
      })
      return data
    },
  }
}
