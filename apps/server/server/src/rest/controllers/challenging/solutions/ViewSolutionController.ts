import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'
import { ViewSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    solutionSlug: string
  }
}

export class ViewSolutionController implements Controller<Schema> {
  constructor(private readonly repository: SolutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionSlug } = http.getRouteParams()
    const useCase = new ViewSolutionUseCase(this.repository)
    const solution = await useCase.execute({
      solutionSlug,
    })
    return http.send(solution)
  }
}
