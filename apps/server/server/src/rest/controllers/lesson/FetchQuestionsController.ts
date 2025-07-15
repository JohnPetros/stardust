import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { QuestionsRepository } from '@stardust/core/lesson/interfaces'
import { Id } from '@stardust/core/global/structures'

type Schema = {
  routeParams: {
    starId: string
  }
}

export class FetchQuestionsController implements Controller<Schema> {
  constructor(private readonly repository: QuestionsRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const response = await this.repository.findAllByStar(Id.create(starId))
    return http.send(response.map((question) => question.dto))
  }
}
