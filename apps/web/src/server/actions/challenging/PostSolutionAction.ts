import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { PostSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Request = {
  solutionTitle: string
  solutionContent: string
  authorId: string
  challengeId: string
}

export const PostSolutionAction = (
  challengingService: IChallengingService,
): IAction<Request, SolutionDto> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { challengeId, solutionTitle, solutionContent, authorId } =
        actionServer.getRequest()
      const useCase = new PostSolutionUseCase(challengingService)
      return await useCase.do({
        challengeId,
        solutionTitle,
        solutionContent,
        authorId,
      })
    },
  }
}
