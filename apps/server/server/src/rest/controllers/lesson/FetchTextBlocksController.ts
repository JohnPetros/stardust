import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { Id } from '@stardust/core/global/structures'

type Schema = {
  routeParams: {
    starId: string
  }
}

export class FetchTextBlocksController implements Controller<Schema> {
  constructor(private readonly repository: TextBlocksRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const response = await this.repository.findAllByStar(Id.create(starId))
    return http.send(response.map((textBlock) => textBlock.dto))
  }
}
