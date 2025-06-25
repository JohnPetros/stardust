import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { Slug } from '@stardust/core/global/structures'
import { Challenge, Solution } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'

type Schema = {
  routeParams: {
    solutionSlug: string
  }
}

export const AccessSolutionPageController = (
  challengingService: ChallengingService,
): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const { solutionSlug } = http.getRouteParams()

      const solutionResponse = await challengingService.fetchSolutionBySlug(
        Slug.create(solutionSlug),
      )
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
