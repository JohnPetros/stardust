import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { ViewSolutionUseCase } from '@stardust/core/challenging/use-cases'
import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'

type Request = {
  solutionSlug: string
}

export const ViewSolutionAction = (
  service: IChallengingService,
): IAction<Request, SolutionDto> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { solutionSlug } = actionServer.getRequest()
      const useCase = new ViewSolutionUseCase(service)
      return await useCase.do({
        solutionSlug,
      })
    },
  }
}
