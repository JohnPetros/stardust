import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import { CreatePlanetUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  body: {
    name: string
    icon: string
    image: string
  }
}

export class CreatePlanetController implements Controller<Schema> {
  constructor(private readonly planetsRepository: PlanetsRepository) {}

  async handle(http: Http<Schema>) {
    const { name, icon, image } = await http.getBody()
    const useCase = new CreatePlanetUseCase(this.planetsRepository)
    const planet = await useCase.execute({ name, icon, image })
    return http.statusCreated().send(planet)
  }
}
