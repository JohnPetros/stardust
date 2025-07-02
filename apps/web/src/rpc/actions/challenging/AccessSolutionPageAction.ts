import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'
import { Slug } from '@stardust/core/global/structures'
import { NotSolutionAuthorError } from '@stardust/core/challenging/errors'

type Request = {
  challengeSlug: string
  solutionSlug?: string
}

type Response = {
  challengeId: string
  solution: SolutionDto | null
}

export const AccessSolutionPageAction = (
  service: ChallengingService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { challengeSlug, solutionSlug } = call.getRequest()
      const user = await call.getUser()
      const response = await service.fetchChallengeBySlug(Slug.create(challengeSlug))

      if (response.isFailure) response.throwError()
      const challenge = response.body

      let solution: SolutionDto | null = null

      if (solutionSlug) {
        const response = await service.fetchSolutionBySlug(Slug.create(solutionSlug))
        if (response.isFailure) response.throwError()
        solution = response.body

        if (solution.author.id !== user.id) throw new NotSolutionAuthorError()
      }

      return {
        challengeId: challenge.id as string,
        solution,
      }
    },
  }
}
