import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'
import { EditSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    solutionId: string
  }
  body: {
    solutionTitle: string
    solutionContent: string
  }
}

export class EditSolutionController implements Controller<Schema> {
  constructor(private readonly repository: SolutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionId } = http.getRouteParams()
    const { solutionTitle, solutionContent } = await http.getBody()
    const useCase = new EditSolutionUseCase(this.repository)
    const solution = await useCase.execute({
      solutionId,
      solutionTitle,
      solutionContent,
    })
    return http.send(solution)
  }
}
