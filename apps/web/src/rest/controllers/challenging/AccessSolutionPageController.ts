import type {
  IController,
  IHttp,
  IChallengingService,
} from '@stardust/core/global/interfaces'
import { Challenge, Solution } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'

type Schema = {
  routeParams: {
    solutionSlug: string
  }
}

export const AccessSolutionPageController = (
  challengingService: IChallengingService,
): IController<Schema> => {
  return {
    async handle(http: IHttp<Schema>) {
      const { solutionSlug } = http.getRouteParams()

      const solutionResponse = await challengingService.fetchSolutionBySlug(solutionSlug)
      if (solutionResponse.isFailure) solutionResponse.throwError()
      const solution = Solution.create(solutionResponse.body)

      const challengeResponse = await challengingService.fetchChallengeBySolutionId(
        solution.id,
      )
      if (challengeResponse.isFailure) challengeResponse.throwError()
      const challenge = Challenge.create(challengeResponse.body)

      return http.redirect(
        ROUTES.challenging.challenges.solution(challenge.slug.value, solution.slug.value),
      )
    },
  }
}
