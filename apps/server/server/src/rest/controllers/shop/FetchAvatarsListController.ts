import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import type { Controller } from '@stardust/core/global/interfaces'
import { ListAvatarsUseCase } from '@stardust/core/shop/use-cases'

type Schema = {
  queryParams: {
    search: string
    order: string
    page: number
    itemsPerPage: number
  }
}

export class FetchAvatarsListController implements Controller<Schema> {
  constructor(private readonly avatarsRepository: AvatarsRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const request = http.getQueryParams()
    const useCase = new ListAvatarsUseCase(this.avatarsRepository)
    const response = await useCase.execute(request)
    return http.sendPagination(response)
  }
}
