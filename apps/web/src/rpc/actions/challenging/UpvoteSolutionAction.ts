import { UpvoteSolutionUseCase } from '@stardust/core/challenging/use-cases'
import type { Action, Call, IChallengingService } from '@stardust/core/global/interfaces'

type Request = {
  solutionId: string
}

type Response = {
  upvotesCount: number
  userUpvotedSolutionsIds: string[]
}

export const UpvoteSolutionAction = (
  challeningService: IChallengingService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const userDto = await call.getUser()
      const { solutionId } = call.getRequest()
      const useCase = new UpvoteSolutionUseCase(challeningService)
      return await useCase.do({
        solutionId,
        userDto,
      })
    },
  }
}
