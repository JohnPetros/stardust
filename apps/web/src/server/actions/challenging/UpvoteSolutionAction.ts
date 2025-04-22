import { UpvoteSolutionUseCase } from '@stardust/core/challenging/use-cases'
import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/global/interfaces'

type Request = {
  solutionId: string
}

type Response = {
  upvotesCount: number
  userUpvotedSolutionsIds: string[]
}

export const UpvoteSolutionAction = (
  challeningService: IChallengingService,
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const userDto = await actionServer.getUser()
      const { solutionId } = actionServer.getRequest()
      const useCase = new UpvoteSolutionUseCase(challeningService)
      return await useCase.do({
        solutionId,
        userDto,
      })
    },
  }
}
