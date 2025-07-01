import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'
import { Slug } from '@stardust/core/global/structures'

type Request = {
  solutionSlug: string
}

type Response = {
  solution: SolutionDto
}

export const ViewSolutionAction = (
  service: ChallengingService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { solutionSlug } = call.getRequest()
      const response = await service.viewSolution(Slug.create(solutionSlug))
      if (response.isFailure) response.throwError()

      return {
        solution: response.body,
      }
    },
  }
}
