import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/global/interfaces'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { EditSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Request = {
  solutionId: string
  solutionTitle: string
  solutionContent: string
}

export const EditSolutionAction = (
  challengingService: IChallengingService,
): IAction<Request, SolutionDto> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { solutionId, solutionTitle, solutionContent } = actionServer.getRequest()
      const useCase = new EditSolutionUseCase(challengingService)
      return await useCase.do({
        solutionId,
        solutionTitle,
        solutionContent,
      })
    },
  }
}
