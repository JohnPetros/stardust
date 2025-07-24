import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StoriesRepository } from '@stardust/core/lesson/interfaces'
import { UpdateStoryUseCase } from '@stardust/core/lesson/use-cases'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    story: string
  }
}

export class UpdateStoryController implements Controller<Schema> {
  constructor(private readonly storiesRepository: StoriesRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const { story } = await http.getBody()
    const useCase = new UpdateStoryUseCase(this.storiesRepository)
    const response = await useCase.execute({ starId, story })
    return http.statusOk().send({ story: response })
  }
}
