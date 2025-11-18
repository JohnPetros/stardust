import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import type { Controller } from '@stardust/core/global/interfaces'

type Schema = {
  queryParams: {
    search: string
    order: string
    page: number
    itemsPerPage: number
  }
}

export class FetchInsigniasListController implements Controller<Schema> {
  constructor(private readonly repository: InsigniasRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const insignias = await this.repository.findAll()
    return http.send(insignias.map((insignia) => insignia.dto))
  }
}
