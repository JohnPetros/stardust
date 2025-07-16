import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StoriesRepository } from '@stardust/core/lesson/interfaces'
import { Id } from '@stardust/core/global/structures'

type Schema = {
  routeParams: {
    starId: string
  }
}

export class FetchStoryController implements Controller<Schema> {
  constructor(private readonly repository: StoriesRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const response = await this.repository.findByStar(Id.create(starId))
    return http.send({ story: response })
  }
}
