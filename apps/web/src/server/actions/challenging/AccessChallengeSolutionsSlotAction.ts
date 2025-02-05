import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import { Challenge } from '@stardust/core/challenging/entities'
import { ROUTES } from '@/constants'
import { User } from '@stardust/core/global/entities'

type Request = {
  challengeSlug: string
}

export const AccessChallengeSolutionsSlotAction = (
  service: IChallengingService,
): IAction<Request> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { challengeSlug } = actionServer.getRequest()
      const user = User.create(await actionServer.getUser())
      const response = await service.fetchChallengeBySlug(challengeSlug)
      if (response.isFailure) response.throwError()
      const challenge = Challenge.create(response.body)

      if (user.hasCompletedChallenge(challenge.id).isFalse) {
        actionServer.redirect(
          ROUTES.challenging.challenges.challenge(challenge.slug.value),
        )
      }
    },
  }
}
