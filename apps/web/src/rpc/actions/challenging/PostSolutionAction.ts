import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'
import { PostSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Request = {
  solutionTitle: string
  solutionContent: string
  authorId: string
  challengeId: string
}

export const PostSolutionAction = (
  challengingService: ChallengingService,
): Action<Request, SolutionDto> => {
  return {
    async handle(call: Call<Request>) {
      const { challengeId, solutionTitle, solutionContent, authorId } = call.getRequest()
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
