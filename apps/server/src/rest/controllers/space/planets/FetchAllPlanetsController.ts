import type { Controller, Http } from '@stardust/core/global/interfaces'
import type {
  GalaxiesRepository,
  PlanetsRepository,
} from '@stardust/core/space/interfaces'

export class FetchAllPlanetsController implements Controller {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
  ) {}

  async handle(http: Http) {
    const galaxy = await this.galaxiesRepository.findFirst()
    if (!galaxy) return http.statusOk().send([])

    const planets = await this.planetsRepository.findAllByGalaxy(galaxy.id)
    return http.statusOk().send(planets.map((planet) => planet.dto))
  }
}
