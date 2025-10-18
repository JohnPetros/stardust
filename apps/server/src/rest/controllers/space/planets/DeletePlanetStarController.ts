import { DeletePlanetStarUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    planetId: string
    starId: string
  }
}

export class DeletePlanetStarController implements Controller<Schema> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { planetId, starId } = http.getRouteParams()
    const useCase = new DeletePlanetStarUseCase(
      this.planetsRepository,
      this.starsRepository,
    )
    await useCase.execute({ planetId, starId })
    return http.statusNoContent().send()
  }
}
