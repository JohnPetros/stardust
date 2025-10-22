import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { DeletePlanetUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  routeParams: {
    planetId: string
  }
}

export class DeletePlanetController implements Controller<Schema> {
  constructor(private readonly planetsRepository: PlanetsRepository) {}

  async handle(http: Http<Schema>) {
    const { planetId } = http.getRouteParams()
    const useCase = new DeletePlanetUseCase(this.planetsRepository)
    await useCase.execute({ planetId })
    return http.statusNoContent().send()
  }
}
