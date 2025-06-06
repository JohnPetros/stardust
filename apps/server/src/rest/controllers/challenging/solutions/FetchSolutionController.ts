import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'
import { GetSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    solutionSlug: string
  }
}

export class FetchSolutionController implements Controller<Schema> {
  constructor(private readonly solutionsRepository: SolutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionSlug } = http.getRouteParams()
    const useCase = new GetSolutionUseCase(this.solutionsRepository)
    const solution = await useCase.execute({ solutionSlug })
    return http.send(solution)
  }
}
