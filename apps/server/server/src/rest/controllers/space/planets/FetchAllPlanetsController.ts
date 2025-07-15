import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'

export class FetchAllPlanetsController implements Controller {
  constructor(private readonly planetsRepository: PlanetsRepository) {}

  async handle(http: Http) {
    const planets = await this.planetsRepository.findAll()
    return http.statusOk().send(planets.map((planet) => planet.dto))
  }
}
