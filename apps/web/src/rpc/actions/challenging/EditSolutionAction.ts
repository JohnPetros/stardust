import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { EditSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Request = {
  solutionId: string
  solutionTitle: string
  solutionContent: string
}

export const EditSolutionAction = (
  challengingService: ChallengingService,
): Action<Request, SolutionDto> => {
  return {
    async handle(call: Call<Request>) {
      const { solutionId, solutionTitle, solutionContent } = call.getRequest()
      const useCase = new EditSolutionUseCase(challengingService)
      return await useCase.do({
        solutionId,
        solutionTitle,
        solutionContent,
      })
    },
  }
}
