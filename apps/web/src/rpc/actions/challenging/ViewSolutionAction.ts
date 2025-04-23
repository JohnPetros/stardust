import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { ViewSolutionUseCase } from '@stardust/core/challenging/use-cases'
import type { Action, Call, IChallengingService } from '@stardust/core/global/interfaces'

type Request = {
  solutionSlug: string
}

export const ViewSolutionAction = (
  service: IChallengingService,
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
