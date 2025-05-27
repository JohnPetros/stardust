import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import type { Controller } from '@stardust/core/global/interfaces'
import { ListRocketsUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  queryParams: {
    search: string
    order: string
    page: number
    itemsPerPage: number
  }
}

export class FetchRocketsListController implements Controller<Schema> {
  constructor(private readonly rocketsRepository: RocketsRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const request = http.getQueryParams()
    const useCase = new ListRocketsUseCase(this.rocketsRepository)
    const response = await useCase.execute(request)
    return http.send(response)
  }
}
