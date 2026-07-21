import type { ChallengeCodeExecutionsRepository } from '@stardust/core/challenging/interfaces'
import { ListChallengeCodeExecutionsUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
  queryParams: {
    page: number
    itemsPerPage: number
  }
}

export class ListChallengeCodeExecutionsController implements Controller<Schema> {
  constructor(private readonly repository: ChallengeCodeExecutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const { page, itemsPerPage } = http.getQueryParams()
    const userId = await http.getAccountId()

    const useCase = new ListChallengeCodeExecutionsUseCase(this.repository)
    const response = await useCase.execute({
      userId,
      challengeId,
      page,
      itemsPerPage,
    })

    return http.sendPagination(response)
  }
}
