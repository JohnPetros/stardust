import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type {
  ChallengeCategoryDto,
  ChallengeDto,
} from '@stardust/core/challenging/entities/dtos'
import { Slug } from '@stardust/core/global/structures'
import { User } from '@stardust/core/profile/entities'
import { Challenge } from '@stardust/core/challenging/entities'

type Request = {
  challengeSlug: string
}

type Response = {
  challenge: ChallengeDto
  categories: ChallengeCategoryDto[]
}

export const AccessChallengeEditorPageAction = (
  service: ChallengingService,
): Action<Request, Response> => {
  async function fetchChallenge(challengeSlug: string, call: Call<Request>) {
    try {
      const response = await service.fetchChallengeBySlug(Slug.create(challengeSlug))
      if (response.isFailure) call.notFound()
      return response.body
    } catch {
      call.notFound()
    }
  }

  async function fetchAllChallengeCategories() {
    const response = await service.fetchAllChallengeCategories()
    if (response.isFailure) response.throwError()
    return response.body
  }

  return {
    async handle(call: Call<Request>) {
      const { challengeSlug } = call.getRequest()
      const user = User.create(await call.getUser())
      const challenge = Challenge.create(await fetchChallenge(challengeSlug, call))
      const categories = await fetchAllChallengeCategories()

      if (challenge.isChallengeAuthor(user.id).isFalse) call.notFound()

      return {
        challenge: challenge.dto,
        categories: categories,
      }
    },
  }
}
