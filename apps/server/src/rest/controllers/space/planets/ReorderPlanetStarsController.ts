import { ReorderPlanetStarsUseCase } from '@stardust/core/space/use-cases'
import type { Controller, EventBroker, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    planetId: string
  }
  body: {
    starIds: string[]
  }
}

export class ReorderPlanetStarsController implements Controller<Schema> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
    private readonly broker: EventBroker,
  ) {}

  async handle(http: Http<Schema>) {
    const { planetId } = http.getRouteParams()
    const { starIds } = await http.getBody()
    const useCase = new ReorderPlanetStarsUseCase(
      this.planetsRepository,
      this.starsRepository,
      this.broker,
    )
    const response = await useCase.execute({ planetId, starIds })
    return http.statusOk().send(response)
  }
}
