import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'
import { DeleteSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    solutionId: string
  }
}

export class DeleteSolutionController implements Controller<Schema> {
  constructor(private readonly repository: SolutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionId } = http.getRouteParams()
    const useCase = new DeleteSolutionUseCase(this.repository)
    await useCase.execute({
      solutionId,
    })
    return http.statusNoContent().send()
  }
}
