import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { GetPlanetOpeningUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  routeParams: {
    planetId: string
  }
  body: {
    completedStarsIds: string[]
    openedPlanetsIds: string[]
  }
}

export class AppendOpenablePlanetToBodyController implements Controller<Schema> {
  constructor(private readonly planetsRepository: PlanetsRepository) {}

  async handle(http: Http<Schema>) {
    const { planetId } = http.getRouteParams()
    const { completedStarsIds, openedPlanetsIds } = await http.getBody()
    const useCase = new GetPlanetOpeningUseCase(this.planetsRepository)
    const opening = await useCase.execute({
      planetId,
      completedStarsIds,
      openedPlanetsIds,
    })
    http.extendBody(opening)
    return http.pass()
  }
}
