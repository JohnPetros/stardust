'use server'

import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import { UnlockDocUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Challenge } from '@stardust/core/challenging/entities'

type Request = {
  challengeSlug: string
}

type Response = {
  challengeDto: ChallengeDto
  userChallengeVote: ChallengeVote
}

export const HandleChallengePageAction = (
  challengingService: IChallengingService,
): IAction<Request, Response> => {
  async function fetchChallengeDto(challengeSlug: string) {
    const response = await challengingService.fetchChallengeBySlug(challengeSlug)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  async function fetchUserChallengeVote(userId: string, challengeId: string) {
    const response = await challengingService.fetchChallengeVote(userId, challengeId)
    if (response.isFailure) response.throwError()
    return response.body.challengeVote
  }

  return {
    async handle(actionServer: IActionServer<Request>) {
      const { challengeSlug } = actionServer.getRequest()
      const userDto = await actionServer.getUser()
      const unlockDocuseCase = new UnlockDocUseCase(challengingService)
      await unlockDocuseCase.do({ userDto, challengeSlug })
      const challenge = await fetchChallengeDto(challengeSlug)
      const userChallengeVote = await fetchUserChallengeVote(
        String(userDto.id),
        challenge.id,
      )

      return {
        challengeDto: challenge.dto,
        userChallengeVote,
      }
    },
  }
}
