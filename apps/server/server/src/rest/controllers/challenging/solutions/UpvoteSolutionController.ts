import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'
import { UpvoteSolutionUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    solutionId: string
  }
  body: {
    isSolutionUpvoted: boolean
  }
}

export class UpvoteSolutionController implements Controller<Schema> {
  constructor(private readonly solutionsRepository: SolutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionId } = http.getRouteParams()
    const { isSolutionUpvoted } = await http.getBody()
    const userId = await http.getAccountId()
    const useCase = new UpvoteSolutionUseCase(this.solutionsRepository)
    const upvotesCount = await useCase.execute({
      solutionId,
      userId,
      isSolutionUpvoted,
    })
    return http.send(upvotesCount)
  }
}
