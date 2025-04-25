import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/global/interfaces'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { VoteChallengeUseCase } from '@stardust/core/challenging/use-cases'
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
  challengingService: IChallengingService,
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const user = User.create(await actionServer.getUser())
      const { challengeId, userChallengeVote } = actionServer.getRequest()
      const useCase = new VoteChallengeUseCase(challengingService)
      const data = await useCase.do({
        challengeId: challengeId,
        userId: user.id.value,
        userChallengeVote,
      })
      return data
    },
  }
}
