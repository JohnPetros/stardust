import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import { EditSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Request = {
  solutionId: string
  solutionTitle: string
  solutionContent: string
}

export const EditSolutionAction = (
  challengingService: IChallengingService,
): IAction<Request> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { solutionId, solutionTitle, solutionContent } = actionServer.getRequest()
      const useCase = new EditSolutionUseCase(challengingService)
      await useCase.do({
        solutionId,
        solutionTitle,
        solutionContent,
      })
    },
  }
}
