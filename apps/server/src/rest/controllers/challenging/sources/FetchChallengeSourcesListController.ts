import { ListChallengeSourcesUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengeSourcesRepository } from '@stardust/core/challenging/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  queryParams: {
    page: number
    itemsPerPage: number
    title: string
  }
}

export class FetchChallengeSourcesListController implements Controller<Schema> {
  constructor(private readonly repository: ChallengeSourcesRepository) {}

  async handle(http: Http<Schema>) {
    const { page, itemsPerPage, title } = http.getQueryParams()
    const useCase = new ListChallengeSourcesUseCase(this.repository)
    const response = await useCase.execute({ page, itemsPerPage, title })
    return http.sendPagination(response)
  }
}
