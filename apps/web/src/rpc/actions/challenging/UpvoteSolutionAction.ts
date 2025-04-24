import { UpvoteSolutionUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Action, Call } from '@stardust/core/global/interfaces'

type Request = {
  solutionId: string
}

type Response = {
  upvotesCount: number
  userUpvotedSolutionsIds: string[]
}

export const UpvoteSolutionAction = (
  challeningService: ChallengingService,
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
