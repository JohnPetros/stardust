import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'
import { ViewSolutionUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Action, Call } from '@stardust/core/global/interfaces'

type Request = {
  solutionSlug: string
}

export const ViewSolutionAction = (
  service: ChallengingService,
): Action<Request, SolutionDto> => {
  return {
    async handle(call: Call<Request>) {
      const { solutionSlug } = call.getRequest()
      const useCase = new ViewSolutionUseCase(service)
      return await useCase.do({
        solutionSlug,
      })
    },
  }
}
