import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'
import { CreatePlanetStarUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  routeParams: {
    planetId: string
  }
}

export class CreatePlanetStarController implements Controller<Schema> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { planetId } = http.getRouteParams()
    const useCase = new CreatePlanetStarUseCase(
      this.planetsRepository,
      this.starsRepository,
    )
    const star = await useCase.execute({ planetId })
    return http.statusCreated().send(star)
  }
}
