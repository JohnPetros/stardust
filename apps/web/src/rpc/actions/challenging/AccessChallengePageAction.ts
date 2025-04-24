import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Challenge } from '@stardust/core/challenging/entities'
import { Star } from '@stardust/core/space/entities'
import { User } from '@stardust/core/global/entities'
import type { Id } from '@stardust/core/global/structures'

type Request = {
  challengeSlug: string
}

type Response = {
  challengeDto: ChallengeDto
  userChallengeVote: ChallengeVote
}

export const AccessChallengePageAction = (
  challengingService: ChallengingService,
  spaceService: SpaceService,
): Action<Request, Response> => {
  async function fetchChallenge(challengeSlug: string) {
    const response = await challengingService.fetchChallengeBySlug(challengeSlug)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  async function fetchChallengeStar(starId: Id) {
    const response = await spaceService.fetchStarById(starId.value)
    if (response.isFailure) response.throwError()
    return Star.create(response.body)
  }

  async function fetchUserChallengeVote(challengeId: Id, userId: Id) {
    const response = await challengingService.fetchChallengeVote(
      challengeId.value,
      userId.value,
    )
    if (response.isFailure) return null
    return response.body.challengeVote
  }

  return {
    async handle(call: Call<Request>) {
      const { challengeSlug } = call.getRequest()
      const user = User.create(await call.getUser())
      const challenge = await fetchChallenge(challengeSlug)

      if (challenge.starId) {
        const star = await fetchChallengeStar(challenge.starId.value)
        if (user.hasUnlockedStar(star.id).isFalse) call.notFound()
      }

      if (challenge.isPublic.isFalse && challenge.authorId !== user.id) {
        call.notFound()
      }

      const userChallengeVote = await fetchUserChallengeVote(challenge.id, user.id)

      return {
        challengeDto: challenge.dto,
        userChallengeVote,
      }
    },
  }
}
