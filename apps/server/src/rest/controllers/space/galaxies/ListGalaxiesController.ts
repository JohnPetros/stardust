import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { GalaxiesRepository } from '@stardust/core/space/interfaces'
import { ListGalaxiesUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  body: {
    currentGalaxyId: string | null
    completedPlanetsIds: string[]
  }
}

export class ListGalaxiesController implements Controller<Schema> {
  constructor(private readonly galaxiesRepository: GalaxiesRepository) {}

  async handle(http: Http<Schema>) {
    const { currentGalaxyId, completedPlanetsIds } = await http.getBody()
    const useCase = new ListGalaxiesUseCase(this.galaxiesRepository)
    const galaxies = await useCase.execute({ currentGalaxyId, completedPlanetsIds })
    return http.statusOk().send(galaxies)
  }
}
