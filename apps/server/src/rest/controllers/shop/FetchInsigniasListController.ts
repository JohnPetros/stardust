import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import type { Controller } from '@stardust/core/global/interfaces'

export class FetchInsigniasListController implements Controller {
  constructor(private readonly repository: InsigniasRepository) {}

  async handle(http: Http): Promise<RestResponse> {
    const insignias = await this.repository.findAll()
    return http.send(insignias.map((insignia) => insignia.dto))
  }
}
