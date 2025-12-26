import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { GetGuideUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  routeParams: {
    guideId: string
  }
}

export class FetchGuideController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { guideId } = http.getRouteParams()
    const useCase = new GetGuideUseCase(this.repository)
    const response = await useCase.execute({ guideId })
    return http.send(response)
  }
}
