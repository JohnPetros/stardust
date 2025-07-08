import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { TiersRepository } from '@stardust/core/ranking/interfaces'

type Schema = {
  routeParams: {
    tierId: string
  }
}

export class FetchAllTiersController implements Controller<Schema> {
  constructor(private readonly repository: TiersRepository) {}

  async handle(http: Http<Schema>) {
    const response = await this.repository.findAll()
    return http.send(response.map((tier) => tier.dto))
  }
}
