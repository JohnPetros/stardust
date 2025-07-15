import { GetStarUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    starSlug?: string
    starId?: string
  }
}

export class FetchStarController implements Controller<Schema> {
  constructor(private readonly starsRepository: StarsRepository) {}

  async handle(http: Http<Schema>) {
    const { starSlug, starId } = http.getRouteParams()
    const useCase = new GetStarUseCase(this.starsRepository)
    const star = await useCase.execute({ starSlug, starId })
    return http.statusOk().send(star)
  }
}
