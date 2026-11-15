import type { Controller, Http } from '@stardust/core/global/interfaces'
import type {
  GalaxiesRepository,
  PlanetsRepository,
} from '@stardust/core/space/interfaces'
import { ListGalaxyPlanetsUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  routeParams: {
    galaxySlug: string
  }
}

export class ListGalaxyPlanetsController implements Controller<Schema> {
  constructor(
    private readonly galaxiesRepository: GalaxiesRepository,
    private readonly planetsRepository: PlanetsRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { galaxySlug } = http.getRouteParams()
    const useCase = new ListGalaxyPlanetsUseCase(
      this.galaxiesRepository,
      this.planetsRepository,
    )
    const planets = await useCase.execute({ galaxySlug })
    return http.statusOk().send(planets)
  }
}
