import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Challenge } from '@stardust/core/challenging/entities'
import { ROUTES } from '@/constants'

type Request = {
  challengeSlug: string
}

type Response = {
  challengeDto: ChallengeDto
  userChallengeVote: ChallengeVote
}

export const AccessChallengePageAction = (
  challengingService: IChallengingService,
): IAction<Request, Response> => {
  async function fetchChallenge(challengeSlug: string) {
    const response = await challengingService.fetchChallengeBySlug(challengeSlug)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  async function fetchUserChallengeVote(challengeId: string, userId: string) {
    const response = await challengingService.fetchChallengeVote(challengeId, userId)
    if (response.isFailure) return null
    return response.body.challengeVote
  }

  return {
    async handle(actionServer: IActionServer<Request>) {
      const { challengeSlug } = actionServer.getRequest()
      const userDto = await actionServer.getUser()
      const challenge = await fetchChallenge(challengeSlug)

      if (challenge.isPublic.isFalse && challenge.author.id !== userDto.id) {
        actionServer.redirect(ROUTES.challenging.challenges.list)
      }

      const userChallengeVote = await fetchUserChallengeVote(
        challenge.id,
        String(userDto.id),
      )

      return {
        challengeDto: challenge.dto,
        userChallengeVote,
      }
    },
  }
}
