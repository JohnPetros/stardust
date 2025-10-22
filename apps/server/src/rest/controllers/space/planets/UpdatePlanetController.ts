import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { UpdatePlanetUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  routeParams: {
    planetId: string
  }
  body: {
    name?: string
    icon?: string
    image?: string
  }
}

export class UpdatePlanetController implements Controller<Schema> {
  constructor(private readonly planetsRepository: PlanetsRepository) {}

  async handle(http: Http<Schema>) {
    const { planetId } = http.getRouteParams()
    const { name, icon, image } = await http.getBody()
    const useCase = new UpdatePlanetUseCase(this.planetsRepository)
    const planet = await useCase.execute({ planetId, name, icon, image })
    return http.statusOk().send(planet)
  }
}
