import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Challenge } from '@stardust/core/challenging/entities'
import { ROUTES } from '@/constants'
import { User } from '@stardust/core/global/entities'

type Request = {
  challengeSlug: string
}

type Response = {
  challengeId: string
}

export const AccessChallengeCommentsSlotAction = (
  service: IChallengingService,
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { challengeSlug } = actionServer.getRequest()
      const response = await service.fetchChallengeBySlug(challengeSlug)
      if (response.isFailure) response.throwError()
      const challenge = Challenge.create(response.body)

      // if (user.hasCompletedChallenge(challenge.id).isFalse) {
      //   actionServer.redirect(
      //     ROUTES.challenging.challenges.challenge(challenge.slug.value),
      //   )
      // }

      return {
        challengeId: challenge.id,
      }
    },
  }
}
